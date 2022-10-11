import Model from "@/Database/Model";

export enum ProjectTrackingPriority {
  "Non",
  "High priority",
  "Mid priority",
  "Low priority",
}

export enum TrackingStatus {
  "Pending",
  "Responded",
}

export interface ProjectTrackingAttributes {
  id: string;
  project_id: string;
  priority: ProjectTrackingPriority;
  assigned_teams: string[]; ///user_id[]; // brand users
  created_at: string;
  updated_at: string | null;
  read_by: string[];
}

export default class ProjectTrackingModel extends Model<ProjectTrackingAttributes> {
  protected table = "project_trackings";
  protected softDelete = true;
}
