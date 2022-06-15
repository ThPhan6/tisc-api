export interface IBrandsResponse {
  data: {
    brands: IBrand[];
    pagination: {
      page: number;
      page_size: number;
      total: number;
      page_count: number;
    };
  };
  statusCode: number;
}

export interface IBrandResponse {
  data: any;
  statusCode: number;
}
export interface IBrandByAlphabetResponse {
  data: {
    abc: any[];
    def: any[];
    ghi: any[];
    jkl: any[];
    mno: any[];
    pqr: any[];
    stuv: any[];
    wxyz: any[];
  };
  statusCode: number;
}

export interface IBrand {
  id: string;
  name: string;
  logo: string;
  origin: string;
  locations: number;
  teams: number;
  distributors: number;
  coverages: number;
  categories: number;
  collections: number;
  cards: number;
  products: number;
  assign_team: any;
  status: number;
  status_key: any;
  created_at: string;
}
