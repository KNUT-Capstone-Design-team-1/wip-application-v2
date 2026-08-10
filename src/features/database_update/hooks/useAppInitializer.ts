import { useState, useRef } from 'react';
import { IUpdateProgress } from '../types';
import { useAppLifecycle } from './useAppLifecycle';
import { useAppBoot } from './useAppBoot';
import { useDatabaseSync } from './useDatabaseSync';

/**
 * 앱 초기화 로직 담당 커스텀 훅 (외부 설정 로드 및 데이터베이스 초기화/업데이트 관리)
 * @returns 초기화 진행 상세 상태
 */
export const useAppInitializer = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [updateProgress, setUpdateProgress] = useState<IUpdateProgress>({
    status: '데이터 동기화 준비 중',
    progress: 0,
    isUpdating: false,
  });

  const currentTableIndexRef = useRef(0);

  useAppLifecycle(currentTableIndexRef);
  useAppBoot(currentTableIndexRef, setUpdateProgress, setIsInitializing);
  useDatabaseSync(currentTableIndexRef, setUpdateProgress, setIsInitializing);

  return { isInitializing, updateProgress };
};
