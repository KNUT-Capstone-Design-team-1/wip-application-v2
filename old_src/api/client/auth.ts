import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import forge from 'node-forge';

const getToken = () => {
  const rsaPubKey = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_RSA_PUB_KEY?.replace(
    /\\n/g,
    '\n',
  );

  dayjs.extend(utc);
  const now = dayjs.utc().format();

  try {
    const publicKey = forge.pki.publicKeyFromPem(rsaPubKey as string);
    const encrypted = publicKey.encrypt(now, 'RSA-OAEP', {
      md: forge.md.sha1.create(),
      mgf1: {
        md: forge.md.sha1.create(),
      },
    });

    return forge.util.encode64(encrypted);
  } catch (error) {
    console.error('Error encrypting token:', error);
    return '';
  }
};

export { getToken };
