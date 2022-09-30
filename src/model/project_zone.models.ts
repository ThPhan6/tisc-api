import { IProjectZoneAttributes } from "@/types";
import Model from "@/Database/Model";

export default class ProjectZoneModel extends Model<IProjectZoneAttributes> {
  protected table = "project_zones";
  protected softDelete = true;
}
