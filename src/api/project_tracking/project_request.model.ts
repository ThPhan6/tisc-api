import Model from "@/Database/Model";

export enum ProjectRequestStatus {
  "Pending",
  "Responded",
}

export interface ProjectRequestAttributes {
  id: string;
  project_id: string;
  project_tracking_id: string; // project_trackings table
  product_id: string;
  title: string;
  message: string;
  request_for_ids: string[]; // common type
  status: ProjectRequestStatus;
  read_by: string[]; // user_id[];
  created_at: string;
  updated_at: null | string;
  created_by: string;
}

export interface CreateProjectRequestBody {
  project_id: string;
  product_id: string;
  title: string;
  message: string;
  request_for_ids: string[]; // common type
}

export default class ProjectRequestModel extends Model<ProjectRequestAttributes> {
  protected table = "project_requests";
  protected softDelete = true;
}
