import Model from "@/Database/Model";

export interface ProductSpecificationSelection {
  is_refer_document: boolean;
  attribute_groups: {
    id: string;
    attributes: {
      id: string;
      basis_option_id: string;
    }[];
  }[];
}

export interface UserProductSpecificationAttributes {
  id: string;
  product_id: string;
  user_id: string;

  specification: ProductSpecificationSelection;

  // vendor
  brand_location_id?: string;
  distributor_location_id?: string;

  created_at: string;
  updated_at: string;
}

export interface UserProductSpecificationRequest {
  specification: ProductSpecificationSelection;

  // vendor
  brand_location_id: string;
  distributor_location_id: string;
}

export default class UserProductSpecificationModel extends Model<UserProductSpecificationAttributes> {
  protected table = "user_product_specifications";
  protected softDelete = true;
}
