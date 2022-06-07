import { IProductSettingAttributes } from "../api/product-setting/product_setting.type";
import Model from "./index";

export const CATEGORY_NULL_ATTRIBUTES = {
  id: null,
  name: null,
  subs: null,
  type: null,
  created_at: null,
  is_deleted: false,
};

export default class ProductSettingModel extends Model<IProductSettingAttributes> {
  constructor() {
    super("category_basis_attributes");
  }
}
