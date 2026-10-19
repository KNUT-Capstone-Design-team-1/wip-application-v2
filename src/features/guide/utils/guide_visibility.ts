import type { StorageAdapter, Visibility } from '../types/guide_type';

const KEY_PREFIX = 'guide:seen:';

/**
 * 자동 노출 여부 판단.
 * - always: 항상 true
 * - never:  항상 false
 * - once:   저장된 버전이 현재 version 미만이면 true (최초/업데이트 시 1회)
 */
export async function shouldAutoShow(
  storage: StorageAdapter,
  tourId: string,
  visibility: Visibility,
  version: number,
): Promise<boolean> {
  if (visibility === 'never') return false;
  if (visibility === 'always') return true;

  const raw = await Promise.resolve(storage.getItem(KEY_PREFIX + tourId));
  const seen = raw ? parseInt(raw, 10) : 0;
  return !(seen >= version);
}

// 현재 버전을 본 것으로 기록 (once 재노출 방지)
export async function markSeen(
  storage: StorageAdapter,
  tourId: string,
  version: number,
): Promise<void> {
  await Promise.resolve(storage.setItem(KEY_PREFIX + tourId, String(version)));
}
