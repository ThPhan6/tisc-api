import Model from "@/Database/Model";

export interface LogAttributes {
  id: string;
  extra: any;
  message: string;
  created_at: string;
}

export default class LogModel extends Model<LogAttributes> {
  protected table = "logs";
  protected softDelete = false;
}
