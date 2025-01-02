import Model from "@/Database/Model";
import { ProjectTrackingEntity } from "@/types";

export default class ProjectTrackingModel extends Model<ProjectTrackingEntity> {
  protected table = "project_trackings";
  protected softDelete = true;
}
