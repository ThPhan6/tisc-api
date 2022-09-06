export interface IConsideredProductsResponse {
  data: {
    summary: { name: string; value: number }[];
    considered_products: any[];
  };
  statusCode: number;
}
export interface StatusConsideredProductRequest {
  status: number;
}

export interface IRoom {
  room_name: string;
  room_id: string;
  room_size: number;
  quantity: number;
  id: string;
  products: {
    id: string;
    name: string;
    image: string;
    brand_id: string;
    brand_name: string;
    collection_id: string;
    collection_name: string;
    assigned_by: string;
    assigned_name: string;
    status: 1;
    status_name: string;
    description: string;
    brand_logo: string;
    considered_id: string;
    project_zone_id: string;
  }[];
  count: number;
}
