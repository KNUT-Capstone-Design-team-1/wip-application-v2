import { useState, useEffect } from 'react';
import { settingService } from '../services/setting_service';
import { IDatabaseVersionInfo } from '../types/version_info';

// 앱 내 모든 데이터베이스 테이블의 버전 정보 목록을 가져오는 커스텀 훅
export const useDatabaseVersions = () => {
  const [versions, setVersions] = useState<IDatabaseVersionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchVersions = async () => {
      try {
        setIsLoading(true);
        const versionList = await settingService.getDatabaseVersions();
        if (isMounted) {
          setVersions(versionList);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchVersions();

    return () => {
      isMounted = false;
    };
  }, []);

  return { versions, isLoading };
};
