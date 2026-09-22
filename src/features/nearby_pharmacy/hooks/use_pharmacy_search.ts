import { useState, useCallback, useRef } from 'react';
import { INearbyPharmacies } from '@services/database/types';
import { usePharmacyToast } from '@features/nearby_pharmacy/hooks/use_pharmacy_toast';
import { nearbyPharmacyService } from '@features/nearby_pharmacy/services/nearby_pharmacy_service';
import {
  ILastFetchedCenter,
  IPharmacySearchCoordinates,
} from '@features/nearby_pharmacy/types/pharmacy_domain_type';
import { IUsePharmacySearchReturn } from '@features/nearby_pharmacy/types/nearby_pharmacy_hook_type';
import { DEFAULT_PAGE_SIZE_LIMIT } from '@features/nearby_pharmacy/constants/search';
import logger from '@utils/logger';

// 약국 데이터 검색 및 로딩 상태를 전담하는 커스텀 훅
export const usePharmacySearch = (): IUsePharmacySearchReturn => {
  // 토스트 메시지 훅
  const { showToast } = usePharmacyToast();

  // 조회된 약국 데이터 목록
  const [pharmacies, setPharmacies] = useState<INearbyPharmacies[]>([]);

  // 데이터 조회 로딩 상태
  const [loading, setLoading] = useState(true);

  // 마지막으로 검색을 수행한 중심 좌표
  const [lastFetchedCenter, setLastFetchedCenter] =
    useState<ILastFetchedCenter | null>(null);

  // 비동기 요청 경쟁 상태(Race Condition) 방어용 Request ID
  const searchRequestIdRef = useRef(0);

  // 특정 좌표 기준 주변 약국 목록 비동기 조회
  const fetchPharmacies = useCallback(
    async (coords: IPharmacySearchCoordinates) => {
      // 요청마다 고유 Request ID 증가
      const currentRequestId = ++searchRequestIdRef.current;

      setLoading(true);

      try {
        // SQLite 데이터 소스를 통한 주변 약국 조회
        const result = await nearbyPharmacyService.searchNearbyPharmacies(
          coords,
          { page: 1, limit: DEFAULT_PAGE_SIZE_LIMIT },
        );

        // 최신 요청이 아니면 오래된 결과 폐기 (early return)
        if (currentRequestId !== searchRequestIdRef.current) {
          return;
        }

        // 약국 목록 및 마지막 검색 위치 업데이트
        setPharmacies(result);

        setLastFetchedCenter({
          lat: coords.y,
          lng: coords.x,
        });
      } catch (e) {
        // 최신 요청이 아닌 에러는 무시 (early return)
        if (currentRequestId !== searchRequestIdRef.current) {
          return;
        }

        logger.error(`Failed to fetch pharmacies: ${e}`);

        showToast({
          type: 'error',
          message: '약국 정보를 가져오는 데 실패했습니다.',
        });
      } finally {
        // 최신 요청일 때만 로딩 해제
        if (currentRequestId === searchRequestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [showToast],
  );

  return {
    pharmacies,
    loading,
    lastFetchedCenter,
    fetchPharmacies,
  };
};
