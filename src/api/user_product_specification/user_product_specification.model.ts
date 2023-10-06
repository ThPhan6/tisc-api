import Model from "@/Database/Model";
import { ConfigurationStepRequest } from "../linkage/linkage.type";

export interface ProductSpecificationSelection {
  is_refer_document: boolean;
  attribute_groups: {
    id: string;
    configuration_steps?: ConfigurationStepRequest[];
    attributes: {
      id: string;
      basis_option_id: string;
    }[];
  }[];
}

export const DEFAULT_USER_SPEC_SELECTION = {
  is_refer_document: true,
  attribute_groups: [],
};

export interface UserProductSpecificationAttributes {
  id: string;
  product_id: string;
  user_id: string;

  custom_product?: boolean;

  specification: ProductSpecificationSelection;

  // vendor
  brand_location_id?: string;
  distributor_location_id?: string;

  created_at: string;
  updated_at: string;
}

export interface UserProductSpecificationRequest {
  specification: ProductSpecificationSelection;
  custom_product?: boolean;

  // vendor
  brand_location_id: string;
  distributor_location_id: string;
}

export default class UserProductSpecificationModel extends Model<UserProductSpecificationAttributes> {
  protected table = "user_product_specifications";
  protected softDelete = true;
}
