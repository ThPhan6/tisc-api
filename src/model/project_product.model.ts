import Model from "@/Database/Model";
import { ProductSpecificationSelection } from "@/api/user_product_specification/user_product_specification.model";

export interface ProjectProductAttributes {
  // basic information
  id: string;
  project_id: string;
  product_id: string;
  status: number; // consider || specified
  consider_status: number; // considered - default || re-considered || unlist
  specified_status: number; // specified - default || re-specify || cancel
  // vendor
  brand_location_id: string;
  distributor_location_id: string;
  /// order
  material_code_id: string;
  material_code: string;
  suffix_code: string;
  description: string;
  quantity: number;
  order_method: number;
  requirement_type_ids: string[];
  instruction_type_ids: string[];
  finish_schedule_ids: string[];
  unit_type_id: string;
  special_instruction: string;
  /// specification
  specification: ProductSpecificationSelection;
  /// alowcation
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
