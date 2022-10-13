import { ActionTaskAttribute } from "@/types/action_task.type";
import Model from "@/Database/Model";

export default class ActionTaskModel extends Model<ActionTaskAttribute> {
  protected table = "actions_tasks";
  protected softDelete = true;
}
