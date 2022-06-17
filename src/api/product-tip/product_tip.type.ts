export interface IProductTipRequest {
  product_id: string;
  title: string;
  content: string;
}

export interface IProductTipResponse {
  data: {
    id: string;
    product_id: string;
    title: string;
    content: string;
    created_at: string;
  };
  statusCode: number;
}

export interface IProductTipsResponse {
  data: {
    id: string;
    product_id: string;
    title: string;
    content: string;
    created_at: string;
  }[];
  statusCode: number;
}
