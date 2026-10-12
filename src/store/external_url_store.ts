import { create } from 'zustand';
import type { IExternalURLResponse } from '@services/apis/google_cloud/wip_external_url';

interface IExternalUrlStore {
  kadaUrl: string;
  healthKrUrl: string;
  nifdsUrl: string;
  foodSafetyKoreaUrl: string;
  reportEmail: string;

  setUrls: (urls: IExternalURLResponse) => void;
}

export const useExternalUrlStore = create<IExternalUrlStore>((set) => ({
  // 기본값 설정
  kadaUrl: 'https://www.kada-ad.or.kr',
  healthKrUrl: 'https://www.health.kr',
  nifdsUrl: 'https://www.nifds.go.kr/toxinfo/kind/kr/cn/cnActive/list.do',
  foodSafetyKoreaUrl:
    'https://www.foodsafetykorea.go.kr/portal/healthyfoodlife/searchHomeHF.do',
  reportEmail: 'knut043mbm@gmail.com',

  setUrls: (urls) =>
    set({
      kadaUrl: urls.kada,
      healthKrUrl: urls.health,
      nifdsUrl: urls.nifds,
      foodSafetyKoreaUrl: urls.foodsafetykorea,
      reportEmail: urls.reportEmail,
    }),
}));
