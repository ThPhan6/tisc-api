import Model from "@/Database/Model";

export interface EmailLogAttributes {
  id: string;
  type: string;
  email: string;
  message: string;
  created_at: string;
}

export default class EmailLogModel extends Model<EmailLogAttributes> {
  protected table = "email_logs";
  protected softDelete = false;
}
