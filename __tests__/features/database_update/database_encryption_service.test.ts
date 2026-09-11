import { databaseEncryptionService } from '../../../src/features/database_update/services/database_encryption_service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-file-system/legacy', () => ({
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
}));

jest.mock('@utils/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('databaseEncryptionService 단위 테스트', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await databaseEncryptionService.clearKey();
  });

  describe('getOrCreateKey', () => {
    it('저장된 키가 없으면 신규 256비트 난수 키를 생성하고 AsyncStorage에 저장해야 한다', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const key = await databaseEncryptionService.getOrCreateKey();

      expect(typeof key).toBe('string');
      expect(key.length).toBeGreaterThan(0);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@db_sync_temp_encryption_key',
        key,
      );
    });

    it('저장된 키가 있으면 해당 키를 반환해야 한다', async () => {
      const existingKey = 'mock-saved-key-1234567890abcdef';
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(existingKey);

      const key = await databaseEncryptionService.getOrCreateKey();

      expect(key).toBe(existingKey);
    });
  });

  describe('encrypt / decrypt', () => {
    it('문자열을 암호화하고 정상적으로 복호화할 수 있어야 한다', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        'test-encryption-key-123456',
      );

      const originalText = JSON.stringify({
        resource: [{ ITEM_SEQ: '12345', ITEM_NAME: '타이레놀' }],
        total: 1,
        totalPage: 1,
      });

      const encrypted = await databaseEncryptionService.encrypt(originalText);
      expect(encrypted).not.toBe(originalText);
      expect(databaseEncryptionService.isEncryptedPayload(encrypted)).toBe(
        true,
      );

      const decrypted = await databaseEncryptionService.decrypt(encrypted);
      expect(decrypted).toBe(originalText);
    });

    it('잘못된 키나 변조된 암호문에 대해 복호화 실패 에러를 발생시켜야 한다', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('valid-key');

      await expect(
        databaseEncryptionService.decrypt('invalid-cipher-text'),
      ).rejects.toThrow();
    });
  });

  describe('encryptFile / readAndDecryptFile', () => {
    it('파일을 암호화하여 다시 저장해야 한다', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('test-file-key');
      const rawJson = JSON.stringify({ resource: [], total: 0 });
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(rawJson);

      await databaseEncryptionService.encryptFile('file:///path/test.json');

      expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
        'file:///path/test.json',
        expect.stringMatching(/^U2FsdGVkX1/),
      );
    });

    it('암호화된 파일을 읽어 복호화된 원본 문자열을 반환해야 한다', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('test-file-key');
      const rawJson = JSON.stringify({ resource: [{ test: 1 }], total: 1 });
      const encrypted = await databaseEncryptionService.encrypt(rawJson);

      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(encrypted);

      const result = await databaseEncryptionService.readAndDecryptFile(
        'file:///path/test.json',
      );
      expect(result).toBe(rawJson);
    });

    it('암호화되지 않은 일반 JSON 파일도 안전하게 fallback으로 읽어야 한다', async () => {
      const plainJson = '{"resource":[],"total":0}';
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(plainJson);

      const result = await databaseEncryptionService.readAndDecryptFile(
        'file:///path/test.json',
      );
      expect(result).toBe(plainJson);
    });
  });

  describe('clearKey', () => {
    it('AsyncStorage에서 키를 삭제해야 한다', async () => {
      await databaseEncryptionService.clearKey();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        '@db_sync_temp_encryption_key',
      );
    });
  });
});
