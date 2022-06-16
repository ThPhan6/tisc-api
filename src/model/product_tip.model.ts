import Model from "./index";
import { IProductTip } from "./../api/product_tip/product_tip.type";
export default class ProductTipModel extends Model<IProductTip> {
  constructor() {
    super("product_tips");
  }
}
