import BaseRepository from "@/repositories/base.repository";
import CustomResouceModel from "@/api/custom_product/custom_resources.model";
import {
  CustomResouceAttribute,
  CustomResouceType,
} from "@/api/custom_product/custom_product.type";

export default class CustomResouceRepository extends BaseRepository<CustomResouceAttribute> {
  protected model: CustomResouceModel;
  protected DEFAULT_ATTRIBUTE: Partial<CustomResouceAttribute> = {
    website_uri: "",
    location_id: "",
    contacts: [],
    associate_resource_ids: [],
    type: CustomResouceType.Brand,
  };
  constructor() {
    super();
    this.model = new CustomResouceModel();
  }
}

export const customResourceRepository = new CustomResouceRepository();
