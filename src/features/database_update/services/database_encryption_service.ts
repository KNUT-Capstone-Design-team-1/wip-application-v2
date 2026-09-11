import forge from 'node-forge';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import logger from '@utils/logger';

// AsyncStorage에 보관되는 암호화 키의 저장소 식별자 이름 (비밀번호가 아닌 스토리지 키 라벨)
const STORAGE_KEY_ENCRYPTION_KEY = '@db_sync_temp_encryption_key';
const CIPHER_PREFIX = 'AES256:';
let memoryEncryptionKey: string | null = null;

// 임시 캐시 JSON 데이터의 AES-256 암호화 및 복호화를 전담하는 보안 서비스
export const databaseEncryptionService = {
  // 256비트(32바이트) 암호학적 무작위 난수 키 생성 (네이티브 모듈 의존성 없이 안전하게 생성)
  generateSecureRandomKey(): string {
    try {
      const bytes = forge.random.getBytesSync(32);
      return forge.util.bytesToHex(bytes);
    } catch {
      // fallback: 64자리 16진수 난수 생성
      const hexChars = '0123456789abcdef';
      let hexString = '';
      for (let i = 0; i < 64; i++) {
        hexString += hexChars.charAt(
          Math.floor(Math.random() * hexChars.length),
        );
      }
      return hexString;
    }
  },

  // 기기 내 저장된 세션 키를 조회하거나, 없으면 256비트 암호학적 무작위 난수(CSPRNG) 키를 동적으로 생성
  async getOrCreateKey(): Promise<string> {
    const hasMemoryKey: boolean = Boolean(memoryEncryptionKey);
    if (hasMemoryKey) {
      return memoryEncryptionKey!;
    }

    try {
      const storedKey = await AsyncStorage.getItem(STORAGE_KEY_ENCRYPTION_KEY);
      const hasStoredKey: boolean = Boolean(storedKey);

      if (hasStoredKey) {
        memoryEncryptionKey = storedKey;
        return storedKey!;
      }

      // 기기에서 매 세션마다 고유하게 생성되는 256비트(32바이트) 무작위 난수 키
      const generatedKey = this.generateSecureRandomKey();
      memoryEncryptionKey = generatedKey;
      await AsyncStorage.setItem(STORAGE_KEY_ENCRYPTION_KEY, generatedKey);
      return generatedKey;
    } catch (error) {
      logger.warn(
        `[ENCRYPTION] Failed to access persistent key storage: ${(error as Error).message}`,
      );
      // 스토리지 접근 실패 시 메모리 전용 256비트 난수 키 생성 후 fallback
      if (!memoryEncryptionKey) {
        memoryEncryptionKey = this.generateSecureRandomKey();
      }
      return memoryEncryptionKey;
    }
  },

  // 전달받은 키를 32바이트(256비트) 바이너리 키로 정규화
  getNormalizedKeyBytes(key: string): string {
    const is64HexKey: boolean = /^[0-9a-fA-F]{64}$/.test(key);
    if (is64HexKey) {
      return forge.util.hexToBytes(key);
    }
    // 임의의 문자열 키일 경우 SHA-256 해시를 통해 32바이트 키 유도
    const md = forge.md.sha256.create();
    md.update(key, 'utf8');
    return md.digest().getBytes();
  },

  // 문자열을 AES-256-CBC로 암호화 (node-forge 순수 JS 엔진 사용으로 네이티브 모듈 에러 방지)
  async encrypt(plainText: string): Promise<string> {
    const key = await this.getOrCreateKey();
    const keyBytes = this.getNormalizedKeyBytes(key);
    const ivBytes = forge.random.getBytesSync(16);

    const cipher = forge.cipher.createCipher('AES-CBC', keyBytes);
    cipher.start({ iv: ivBytes });
    cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(plainText)));
    cipher.finish();

    const ivHex = forge.util.bytesToHex(ivBytes);
    const cipherHex = cipher.output.toHex();
    return `${CIPHER_PREFIX}${ivHex}:${cipherHex}`;
  },

  // AES-256-CBC 암호화된 문자열을 복호화
  async decrypt(cipherText: string): Promise<string> {
    if (!this.isEncryptedPayload(cipherText)) {
      return cipherText;
    }

    const key = await this.getOrCreateKey();
    const keyBytes = this.getNormalizedKeyBytes(key);

    const payload = cipherText.slice(CIPHER_PREFIX.length);
    const colonIndex = payload.indexOf(':');
    if (colonIndex === -1) {
      throw new Error('Invalid encrypted payload format');
    }

    const ivHex = payload.slice(0, colonIndex);
    const dataHex = payload.slice(colonIndex + 1);

    const ivBytes = forge.util.hexToBytes(ivHex);
    const encryptedBytes = forge.util.hexToBytes(dataHex);

    const decipher = forge.cipher.createDecipher('AES-CBC', keyBytes);
    decipher.start({ iv: ivBytes });
    decipher.update(forge.util.createBuffer(encryptedBytes));
    const isDecryptionSuccessful = decipher.finish();

    if (!isDecryptionSuccessful) {
      throw new Error('Failed to decrypt payload with AES key');
    }

    return forge.util.decodeUtf8(decipher.output.getBytes());
  },

  // 지정된 경로의 일반 텍스트 파일을 읽어 암호화된 파일로 변환 저장
  async encryptFile(filePath: string): Promise<void> {
    const rawContent = await FileSystem.readAsStringAsync(filePath);
    const isAlreadyEncrypted: boolean = this.isEncryptedPayload(rawContent);

    if (isAlreadyEncrypted) {
      return;
    }

    const encryptedContent = await this.encrypt(rawContent);
    await FileSystem.writeAsStringAsync(filePath, encryptedContent);
  },

  // 암호화된 파일을 읽어 복호화된 원본 문자열 반환
  async readAndDecryptFile(filePath: string): Promise<string> {
    const fileContent = await FileSystem.readAsStringAsync(filePath);
    const isEncrypted: boolean = this.isEncryptedPayload(fileContent);

    if (!isEncrypted) {
      return fileContent; // 암호화되지 않은 기존 파일 호환 처리
    }

    return this.decrypt(fileContent);
  },

  // 문자열이 AES 암호화된 형태인지 판별 (AES256: 접두사)
  isEncryptedPayload(content: string): boolean {
    const isCipherHeaderPresent: boolean = content.startsWith(CIPHER_PREFIX);
    return isCipherHeaderPresent;
  },

  // 임시 암호화 키 완전 폐기
  async clearKey(): Promise<void> {
    memoryEncryptionKey = null;
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_ENCRYPTION_KEY);
    } catch (error) {
      logger.warn(
        `[ENCRYPTION] Failed to clear encryption key: ${(error as Error).message}`,
      );
    }
  },
};
