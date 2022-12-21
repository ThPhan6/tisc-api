import Model from "@/Database/Model";

export enum ProjectTrackingNotificationType {
  "Deleted",
  "Considered",
  "Re-considered",
  "Unlisted",
  "Specified",
  "Re-specified",
  "Cancelled",
}

export enum ProjectTrackingNotificationStatus {
  "Keep-in-view",
  "Followed-up",
}

export interface ProjectTrackingNotificationAttributes {
  id: string;
  project_tracking_id: string; // project_trackings table
  project_product_id: string;

  type: ProjectTrackingNotificationType;
  status: ProjectTrackingNotificationStatus;
  read_by: string[]; // user_id[];
  created_by: string;

  created_at: string;
  updated_at: null | string;
}

export default class ProjectTrackingNotificationModel extends Model<ProjectTrackingNotificationAttributes> {
  protected table = "project_tracking_notifications";
  protected softDelete = true;
}
