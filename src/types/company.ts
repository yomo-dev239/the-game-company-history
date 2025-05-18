export type Company = {
  id: string; // スラグ（URL識別子）例: "nintendo"
  name: string; // 正式社名
  established: string; // 設立年月日（例: "1889-09-23"）
  headquarters: string; // 本社所在地
  description: string; // 概要（300〜500字程度）
  notableWorks: string[]; // 代表作（タイトル名）
  history: {
    year: string;
    event: string;
  }[];
  relatedCompanies?: string[]; // 関連企業（任意）
  website?: string; // 公式サイトURL（任意）
};
