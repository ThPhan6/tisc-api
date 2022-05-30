export interface IBrandsResponse {
  data: {
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
    created_at: string;
  }[];
  statusCode: number;
}

export interface IBrandResponse {
  data: any;
  statusCode: number;
}
