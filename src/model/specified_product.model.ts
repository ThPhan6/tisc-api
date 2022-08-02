import Model from "./index";

export interface ISpecifiedProductAttributes {
  id: string;
  considered_product_id: string;
  specification: {
    is_refer_document: boolean;
    specification_attribute_groups: {
      id: string;
      attributes: {
        id: string;
        basis_option_id: string;
      }[];
    }[];
  };

  brand_location_id: string;
  distributor_location_id: string;

  is_entire: boolean;
  project_zone_ids: string[];

  material_code_id: string;
  suffix_code: string;
  description: string;
  quantity: number;
  unit_type_id: string;
  order_method: number;
  requirement_type_ids: string[];
  instruction_type_ids: string[];
  created_at: string;
  is_deleted: boolean;
}

export const SPECIFIED_PRODUCT_NULL_ATTRIBUTES = {
  id: null,
  considered_product_id: null,
  specification: {
    is_refer_document: true,
  },
  brand_location_id: null,
  distributor_location_id: null,
  is_entire: true,
  project_zone_ids: [],
  material_code_id: null,
  suffix_code: null,
  description: null,
  quantity: 0,
  unit_type_id: null,
  order_method: 0,
  requirement_type_ids: [],
  instruction_type_ids: [],
  created_at: null,
  is_deleted: false,
};
export default class SpecifiedProductTipModel extends Model<ISpecifiedProductAttributes> {
  constructor() {
    super("specified_products");
  }
}
