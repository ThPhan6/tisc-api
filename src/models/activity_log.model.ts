import Model from "@/Database/Model";

export interface ActivityLogAttributes {
  id: string;
  user_id: string;
  path: string;
  method: string;
  input: any;
  created_at: string;
}

export default class ActivityLogModel extends Model<ActivityLogAttributes> {
  protected table = "activity_logs";
  protected softDelete = false;
}
