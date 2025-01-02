import Model from "@/Database/Model";
import { ProjectTrackingQuotationDetailEntity } from "@/types";

export default class ProjectTrackingQuotationDetailModel extends Model<ProjectTrackingQuotationDetailEntity> {
  protected table = "project_tracking_quotation_details";
  protected softDelete = true;
}
