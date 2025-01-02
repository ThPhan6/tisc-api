import Model from "@/Database/Model";
import { ProjectTrackingQuotationEntity } from "@/types";

export default class ProjectTrackingQuotationModel extends Model<ProjectTrackingQuotationEntity> {
  protected table = "project_tracking_quotations";
  protected softDelete = true;
}
