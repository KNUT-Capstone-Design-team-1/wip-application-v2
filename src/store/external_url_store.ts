import { create } from 'zustand';

interface IExternalUrlStore {
  kadaUrl: string;
  healthKrUrl: string;
  reportEmail: string;

  setUrls: (urls: {
    kada: string;
    health: string;
    reportEmail: string;
  }) => void;
}

export const useExternalUrlStore = create<IExternalUrlStore>((set) => ({
  // 기본값 설정
  kadaUrl: 'https://www.kada-ad.or.kr',
  healthKrUrl: 'https://www.health.kr',
  reportEmail: 'knut043mbm@gmail.com',

  setUrls: (urls) =>
    set({
      kadaUrl: urls.kada,
      healthKrUrl: urls.health,
      reportEmail: urls.reportEmail,
    }),
}));
