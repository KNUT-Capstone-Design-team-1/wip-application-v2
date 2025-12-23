// sigv4.ts gpt-5-high 생성
import { hmac } from '@noble/hashes/hmac.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, utf8ToBytes } from '@noble/hashes/utils.js';

type SigCreds = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
};
type SignedHeaders = Record<string, string>;

const SERVICE = 's3'; // R2는 s3 호환
const REGION = 'auto'; // R2 권장
const ALGO = 'AWS4-HMAC-SHA256';

function nowDates(d = new Date()) {
  const pad = (n: number, w = 2) => n.toString().padStart(w, '0');
  const YYYY = d.getUTCFullYear();
  const MM = pad(d.getUTCMonth() + 1);
  const DD = pad(d.getUTCDate());
  const hh = pad(d.getUTCHours());
  const mm = pad(d.getUTCMinutes());
  const ss = pad(d.getUTCSeconds());
  const amzDate = `${YYYY}${MM}${DD}T${hh}${mm}${ss}Z`; // x-amz-date
  const dateStamp = `${YYYY}${MM}${DD}`; // scope용
  return { amzDate, dateStamp };
}

const rfc3986 = (s: string) =>
  encodeURIComponent(s).replace(
    /[!*'()]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );

function canonicalURI(pathname: string) {
  // 각 세그먼트를 RFC3986 인코딩
  return pathname
    .split('/')
    .map((seg) => rfc3986(seg))
    .join('/');
}

function canonicalQuery(init: URLSearchParams) {
  const pairs: string[] = [];
  // 정렬 규칙: key → value ASCII 오름차순
  const entries = Array.from(init.entries()).sort(([ak, av], [bk, bv]) =>
    ak === bk ? (av < bv ? -1 : av > bv ? 1 : 0) : ak < bk ? -1 : 1,
  );
  for (const [k, v] of entries) {
    pairs.push(`${rfc3986(k)}=${rfc3986(v)}`);
  }
  return pairs.join('&');
}

function canonicalHeaders(headers: Record<string, string>) {
  const list = Object.entries(headers).map(
    ([k, v]) =>
      [k.toLowerCase().trim(), v.trim().replace(/\s+/g, ' ')] as const,
  );
  list.sort(([a], [b]) => (a < b ? -1 : 1));
  const ch = list.map(([k, v]) => `${k}:${v}\n`).join('');
  const sh = list.map(([k]) => k).join(';'); // SignedHeaders
  return { ch, sh };
}

function signingKey(
  secret: string,
  dateStamp: string,
  region = REGION,
  service = SERVICE,
) {
  const kDate = hmac(
    sha256,
    utf8ToBytes('AWS4' + secret),
    utf8ToBytes(dateStamp),
  );
  const kRegion = hmac(sha256, kDate, utf8ToBytes(region));
  const kService = hmac(sha256, kRegion, utf8ToBytes(service));
  const kSign = hmac(sha256, kService, utf8ToBytes('aws4_request'));
  return kSign;
}

// 헤더 서명
export function signRequest(
  method: string,
  urlStr: string,
  creds: SigCreds,
  extraHeaders: Record<string, string> = {},
  payloadHash = 'UNSIGNED-PAYLOAD',
) {
  const url = new URL(urlStr);
  const host = url.host;
  const { amzDate, dateStamp } = nowDates();

  // 1) Canonical Request
  const query = new URLSearchParams(url.search); // 기존 쿼리 포함
  const canReq =
    `${method.toUpperCase()}\n` +
    `${canonicalURI(url.pathname)}\n` +
    `${canonicalQuery(query)}\n`;

  const baseHeaders: Record<string, string> = {
    host,
    'x-amz-date': amzDate,
    'x-amz-content-sha256': payloadHash, // GET/HEAD는 UNSIGNED-PAYLOAD 권장
  };
  if (creds.sessionToken)
    baseHeaders['x-amz-security-token'] = creds.sessionToken;

  const merged = { ...baseHeaders, ...extraHeaders };
  const { ch, sh } = canonicalHeaders(merged);

  const canonicalRequest = canReq + ch + '\n' + sh + '\n' + payloadHash;
  const hashCanReq = bytesToHex(sha256(utf8ToBytes(canonicalRequest)));

  // 2) String to sign
  const scope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
  const stringToSign = `${ALGO}\n${amzDate}\n${scope}\n${hashCanReq}`;

  // 3) Signature
  const kSign = signingKey(creds.secretAccessKey, dateStamp);
  const signature = bytesToHex(hmac(sha256, kSign, utf8ToBytes(stringToSign)));

  // 4) Authorization
  const authorization = `${ALGO} Credential=${creds.accessKeyId}/${scope}, SignedHeaders=${sh}, Signature=${signature}`;

  return {
    headers: { ...merged, Authorization: authorization } as SignedHeaders,
  };
}

// 프리사인드 URL(쿼리 서명)
export function presignUrl(
  method: string,
  urlStr: string,
  creds: SigCreds,
  expiresSec = 300,
  signedHeaders: string[] = ['host'],
) {
  const url = new URL(urlStr);
  const host = url.host;
  const { amzDate, dateStamp } = nowDates();

  // X-Amz-* 파라미터 추가
  const scope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
  url.searchParams.set('X-Amz-Algorithm', ALGO);
  url.searchParams.set('X-Amz-Credential', `${creds.accessKeyId}/${scope}`);
  url.searchParams.set('X-Amz-Date', amzDate);
  url.searchParams.set('X-Amz-Expires', String(expiresSec));
  url.searchParams.set('X-Amz-SignedHeaders', signedHeaders.join(';'));
  if (creds.sessionToken)
    url.searchParams.set('X-Amz-Security-Token', creds.sessionToken);

  // Canonical Request (payload hash는 presign에서도 UNSIGNED-PAYLOAD 관례)
  const canReq =
    `${method.toUpperCase()}\n` +
    `${canonicalURI(url.pathname)}\n` +
    `${canonicalQuery(url.searchParams)}\n`;

  // presign에 포함되는 헤더는 최소 host만(일반적 케이스)
  const { ch, sh } = canonicalHeaders({ host });

  const canonicalRequest = canReq + ch + '\n' + sh + '\n' + 'UNSIGNED-PAYLOAD';
  const hashCanReq = bytesToHex(sha256(utf8ToBytes(canonicalRequest)));

  const stringToSign = `${ALGO}\n${amzDate}\n${scope}\n${hashCanReq}`;

  const kSign = signingKey(creds.secretAccessKey, dateStamp);
  const signature = bytesToHex(hmac(sha256, kSign, utf8ToBytes(stringToSign)));

  url.searchParams.set('X-Amz-Signature', signature);
  return url.toString();
}
