import Model from "./index";

export interface IProductTip {
  id: string;
  product_id: string;
  title: string;
  content: string;
  created_at: string;
  is_deleted: boolean;
}

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
  public getDuplicatedProductTip = async (id: string, title: string) => {
    try {
      const result: any = await this.builder
        .whereNot("id", id)
        .whereNot("is_deleted", true)
        .where("title", title.toLowerCase())
        .first();
      return result;
    } catch (error) {
      return false;
    }
  };
}
