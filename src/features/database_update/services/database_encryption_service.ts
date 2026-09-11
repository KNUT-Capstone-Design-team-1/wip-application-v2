import CryptoJS from 'crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import logger from '@utils/logger';

// AsyncStorage에 보관되는 암호화 키의 저장소 식별자 이름 (비밀번호가 아닌 스토리지 키 라벨)
const STORAGE_KEY_ENCRYPTION_KEY = '@db_sync_temp_encryption_key';
let memoryEncryptionKey: string | null = null;

// 임시 캐시 JSON 데이터의 AES-256 암호화 및 복호화를 전담하는 보안 서비스
export const databaseEncryptionService = {
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
      const generatedKey = CryptoJS.lib.WordArray.random(32).toString();
      memoryEncryptionKey = generatedKey;
      await AsyncStorage.setItem(STORAGE_KEY_ENCRYPTION_KEY, generatedKey);
      return generatedKey;
    } catch (error) {
      logger.warn(
        `[ENCRYPTION] Failed to access persistent key storage: ${(error as Error).message}`,
      );
      // 스토리지 접근 실패 시 메모리 전용 256비트 난수 키 생성 후 fallback
      if (!memoryEncryptionKey) {
        memoryEncryptionKey = CryptoJS.lib.WordArray.random(32).toString();
      }
      return memoryEncryptionKey;
    }
  },

  // 문자열을 AES-256으로 암호화
  async encrypt(plainText: string): Promise<string> {
    const key = await this.getOrCreateKey();
    return CryptoJS.AES.encrypt(plainText, key).toString();
  },

  // AES-256 암호화된 문자열을 복호화
  async decrypt(cipherText: string): Promise<string> {
    const key = await this.getOrCreateKey();
    const decryptedBytes = CryptoJS.AES.decrypt(cipherText, key);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

    const isDecryptionSuccessful: boolean = Boolean(decryptedText);
    if (!isDecryptionSuccessful) {
      throw new Error('Failed to decrypt payload with AES key');
    }
    return decryptedText;
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

  // 문자열이 AES 암호화된 형태인지 판별 (U2FsdGVkX1 접두사 등)
  isEncryptedPayload(content: string): boolean {
    const isCipherHeaderPresent: boolean = content.startsWith('U2FsdGVkX1');
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
