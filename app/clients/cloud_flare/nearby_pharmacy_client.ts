import axios, { Axios } from 'axios';

export type TNearbyPharmacy = {
  id: string; // 암호화요양기호
  name: string; // 요양기관명
  states: string; // 시도코드명
  region: string; // 시군구코드명
  district: string; // 읍면동
  postalCode: string; // 우편번호
  address: string; // 주소
  telephone: string; // 전화번호
  openDate: string; // 개설일자
  x: number; // 좌표(X)
  y: number; // 좌표(Y)
};

type TNearbyPharmacyList = {
  success: boolean;
  // Cloudflare workers metadata
  meta: {
    served_by: string;
    duration: number;
    changes: number;
    last_row_id: number;
    changed_db: boolean;
    size_after: number;
    rows_read: number;
    rows_written: number;
  };
  results: TNearbyPharmacy[];
};

type TNearbyPharmacySearchParam = Partial<
  Pick<
    TNearbyPharmacy,
    'states' | 'region' | 'district' | 'address' | 'x' | 'y'
  >
>;

/**
 * 주변 약국 클라이언트
 */
export class NearbyPharmacyClient {
  private readonly apiURL: string;
  private readonly token: string;
  private readonly axiosClient: Axios;

  constructor() {
    this.apiURL = process.env
      .CLOUD_FLARE_WORKERS_NEARBY_PHARMACIES_API_URL as string;

    this.token = process.env.CLOUD_FLARE_WORKERS_TOKEN as string;

    this.axiosClient = axios.create({
      baseURL: this.apiURL,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  /**
   * 주변 약국 목록 조회
   * @param params 주변 약국 검색 파라미터
   * @returns
   */
  public async readNearbyPharmacies(params: TNearbyPharmacySearchParam) {
    const response = await this.axiosClient.get<TNearbyPharmacyList>(
      `/nearby-pharmacies`,
      { params },
    );

    return response.data;
  }
}
