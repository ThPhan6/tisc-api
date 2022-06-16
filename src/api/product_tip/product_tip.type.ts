export interface IProductTip {
  id: string;
  product_id: string;
  title: string;
  content: string;
  created_at: string;
}

export interface IProductTipRequest {
  product_id: string;
  title: string;
  content: string;
}
