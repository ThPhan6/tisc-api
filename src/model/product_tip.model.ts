import Model from "./index";
import { IProductTip } from "../api/product-tip/product_tip.type";
export const PRODUCT_TIP_NULL_ATTRIBUTES = {
  id: null,
  product_id: null,
  title: null,
  content: null,
  created_at: null,
  is_deleted: false,
};
export default class ProductTipModel extends Model<IProductTip> {
  constructor() {
    super("product_tips");
  }
}
