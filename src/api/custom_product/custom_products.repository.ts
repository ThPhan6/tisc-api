import BaseRepository from "@/repositories/base.repository";
import { CustomProductAttribute } from "./custom_product.type";
import CustomProductModel from "./custom_products.model";

export default class CustomProductRepository extends BaseRepository<CustomProductAttribute> {
  protected model: CustomProductModel;
  protected DEFAULT_ATTRIBUTE: Partial<CustomProductAttribute> = {
    name: "",
    description: "",
    images: [],
    attributes: [],
    specification: [],
    options: [],
    collection_id: "",
    company_id: "",
    relation_id: "",
  };

  constructor() {
    super();
    this.model = new CustomProductModel();
  }
}
export const customProductRepository = new CustomProductRepository();
