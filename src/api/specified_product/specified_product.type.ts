export interface ISpecifiedProductRequest {
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
  unit_type: {
    id: string;
    code: string;
  };
  order_method: number;
  requirement_type_ids: string[];
  instruction_type_ids: string[];
  special_instructions: string;
}
export interface ISpecifiedProductResponse {
  data: any;
  statusCode: number;
}

export interface IRequirementTypesResponse {
  data: {
    id: string;
    name: string;
  }[];
  statusCode: number;
}
export interface IInstructionTypesResponse {
  data: {
    id: string;
    name: string;
  }[];
  statusCode: number;
}
export interface IUnitTypesResponse {
  data: {
    id: string;
    name: string;
    code: string;
  }[];
  statusCode: number;
}
