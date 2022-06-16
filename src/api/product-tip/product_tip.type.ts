export interface IProductTip {
  id: string;
  product_id: string;
  title: string;
  content: string;
  created_at: string;
  is_deleted: boolean;
}

export interface IProductTipRequest {
  product_id: string;
  title: string;
  content: string;
}

type TProductTipResponse = Omit<IProductTip, "is_deleted">;

export interface IProductTipResponse {
  data: TProductTipResponse;
  statusCode: number;
}

export interface IProductTipsResponse {
  data: TProductTipResponse[];
  statusCode: number;
}
