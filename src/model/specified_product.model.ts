import Model from "./index";

export interface ISpecifiedProductAttributes {
  id: string;
  considered_product_id: string;
  product_id: string;
  project_id: string;
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
  material_code: string;
  suffix_code: string;
  description: string;
  quantity: number;
  unit_type_id: string;
  order_method: number;
  requirement_type_ids: string[];
  instruction_type_ids: string[];
  special_instructions: string;
  created_at: string;
  status: number;
  is_deleted: boolean;
}

export const SPECIFIED_PRODUCT_NULL_ATTRIBUTES = {
  id: null,
  considered_product_id: null,
  product_id: null,
  project_id: null,
  specification: {
    is_refer_document: true,
    specification_attribute_groups: [],
  },
  brand_location_id: null,
  distributor_location_id: null,
  is_entire: true,
  project_zone_ids: [],
  material_code_id: null,
  material_code: null,
  suffix_code: null,
  description: null,
  quantity: 0,
  unit_type_id: null,
  order_method: 0,
  requirement_type_ids: [],
  instruction_type_ids: [],
  status: 0,
  special_instructions: null,
  created_at: null,
  is_deleted: false,
};
export default class SpecifiedProductTipModel extends Model<ISpecifiedProductAttributes> {
  constructor() {
    super("specified_products");
  }
  public getManyByProduct = (
    product_ids: string[]
  ): Promise<ISpecifiedProductAttributes[]> => {
    try {
      return this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .whereIn("product_id", product_ids)
        .select();
    } catch (error) {
      return Promise.resolve([]);
    }
  };
}
