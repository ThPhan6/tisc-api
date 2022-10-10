import Model from "@/Database/Model";
import { ProductSpecificationSelection } from "@/api/user_product_specification/user_product_specification.model";
import {
  OrderMethod,
  ProductConsiderStatus,
  ProductSpecifyStatus,
  ProjectProductStatus,
} from "./project_product.type";

export interface ProjectProductAttributes {
  // basic information
  id: string;
  project_id: string;
  product_id: string;
  status: ProjectProductStatus; // consider || specified
  consider_status: ProductConsiderStatus; // considered - default || re-considered || unlist
  specified_status: ProductSpecifyStatus; // specified - default || re-specify || cancel
  // vendor
  brand_location_id: string;
  distributor_location_id: string;
  /// order
  material_code_id: string;
  material_code: string;
  suffix_code: string;
  description: string;
  quantity: number;
  order_method: OrderMethod;
  requirement_type_ids: string[];
  instruction_type_ids: string[];
  finish_schedule_ids: string[];
  unit_type_id: string;
  special_instructions: string;
  /// specification
  specification: ProductSpecificationSelection;
  /// allocation
  allocation: string[]; // room_id
  entire_allocation: boolean;
  ///
  created_at: string; // datetime
  created_by: string; // user_id
  updated_at: string;
}

export default class ProjectProductModel extends Model<ProjectProductAttributes> {
  protected table = "project_products";
  protected softDelete = true;
}
