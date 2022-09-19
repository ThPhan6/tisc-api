import { IMaterialCodeAttributes } from "@/types/material_code.type";

import Model from "@/Database/Model";

export default class MaterialCodeModel extends Model<IMaterialCodeAttributes> {
  protected table = "material_codes";
  protected softDelete = true;
}
