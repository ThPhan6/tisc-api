import Model from "@/Database/Model";
import { ProjectAttributes } from "@/types";

export default class ProjectModel extends Model<ProjectAttributes> {
  protected table = "projects";
  protected softDelete = true;
}
