import Model from "@/Database/Model";
import { IAutoEmailAttributes } from "@/types/auto_email.type";
export default class AutoEmailModel extends Model<IAutoEmailAttributes> {
  protected table = "email_autoresponders";
  protected softDelete = true;
}
