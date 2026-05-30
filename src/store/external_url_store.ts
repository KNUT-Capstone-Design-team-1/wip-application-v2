import { create } from 'zustand';

interface IExternalUrlStore {
  kadaUrl: string;
  healthKrUrl: string;
  nifdsUrl: string;
  reportEmail: string;

  setUrls: (urls: {
    kada: string;
    health: string;
    nifds: string;
    reportEmail: string;
  }) => void;
}

export const useExternalUrlStore = create<IExternalUrlStore>((set) => ({
  // 기본값 설정
  kadaUrl: 'https://www.kada-ad.or.kr',
  healthKrUrl: 'https://www.health.kr',
  nifdsUrl: 'https://www.nifds.go.kr/toxinfo/kind/kr/cn/cnActive/list.do',
  reportEmail: 'knut043mbm@gmail.com',

  setUrls: (urls) =>
    set({
      kadaUrl: urls.kada,
      healthKrUrl: urls.health,
      nifdsUrl: urls.nifds,
      reportEmail: urls.reportEmail,
    }),
}));
