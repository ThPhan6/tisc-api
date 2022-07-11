import Model from "./index";

export interface IProductTip {
  id: string;
  product_id: string;
  contents: {
    id: string;
    title: string;
    content: string;
  }[];
  created_at: string;
  is_deleted: boolean;
}

export const PRODUCT_TIP_NULL_ATTRIBUTES = {
  id: null,
  product_id: null,
  contents: [],
  created_at: null,
  is_deleted: false,
};
export default class ProductTipModel extends Model<IProductTip> {
  constructor() {
    super("product_tips");
  }
}
