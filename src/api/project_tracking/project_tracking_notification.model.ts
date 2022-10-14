import Model from "@/Database/Model";

export enum ProjectTrackingNotificationType {
  "Deleted",
  "Considered",
  "Re-Considered",
  "Unlisted",
  "Specified",
  "Re-Specified",
  "Cancelled",
}

export enum ProjectTrackingNotificationStatus {
  "Keep-in-view",
  "Followed-up",
}

export interface ProjectTrackingNotificationAttributes {
  id: string;
  type: ProjectTrackingNotificationType;
  project_tracking_id: string; // project_trackings table
  product_id: string;
  status: ProjectTrackingNotificationStatus;
  read_by: string[]; // user_id[];
  created_at: string;
  updated_at: null | string;
}

export default class ProjectTrackingNotificationModel extends Model<ProjectTrackingNotificationAttributes> {
  protected table = "project_tracking_notifications";
  protected softDelete = true;
}
