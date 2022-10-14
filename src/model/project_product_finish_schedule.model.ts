import Model from "@/Database/Model";
import { ProjectProductFinishSchedule } from "@/types";

export default class ProjectProductFinishScheduleModel extends Model<ProjectProductFinishSchedule> {
  protected table = "project_product_finish_schedules";
  protected softDelete = true;
}
