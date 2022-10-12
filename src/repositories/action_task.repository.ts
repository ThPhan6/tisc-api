import { ActionTaskStatus } from "./../types/action_task.type";
import { ActionTaskAttribute } from "@/types/action_task.type";
import BaseRepository from "@/repositories/base.repository";
import ActionTaskModel from "@/model/action_task.model";
class ActionTaskRepository extends BaseRepository<ActionTaskAttribute> {
  protected model: ActionTaskModel;
  protected DEFAULT_ATTRIBUTE: Partial<ActionTaskAttribute> = {
    model_name: "",
    model_id: "",
    status: ActionTaskStatus.To_do_list,
    created_at: "",
    common_type_ids: [],
    updated_at: null,
    created_by: "",
  };
  constructor() {
    super();
    this.model = new ActionTaskModel();
  }
}
export const actionTaskRepository = new ActionTaskRepository();
export default ActionTaskRepository;
