import Model from "@/Database/Model";
import { IMaterialCodeAttributes } from "@/types/material_code.type";
export default class MaterialModel extends Model<IMaterialCodeAttributes> {
  protected table = "material_codes";
  protected softDelete = true;
}
