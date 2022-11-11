import BaseRepository from "@/repositories/base.repository";
import { CustomProductAttributes } from "./custom_product.type";
import CustomProductModel from "./custom_products.model";

export default class CustomProductRepository extends BaseRepository<CustomProductAttributes> {
  protected model: CustomProductModel;
  protected DEFAULT_ATTRIBUTE: Partial<CustomProductAttributes> = {
    name: "",
    description: "",
    images: [],
    attributes: [],
    specification: [],
    options: [],
    collection_id: "",
    company_id: "",
    design_id: "",
  };

  constructor() {
    super();
    this.model = new CustomProductModel();
  }
}
export const customProductRepository = new CustomProductRepository();
