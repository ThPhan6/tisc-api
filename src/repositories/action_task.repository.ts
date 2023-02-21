import ActionTaskModel from "@/models/action_task.model";
import BaseRepository from "@/repositories/base.repository";
import {
  ActionTaskAttribute,
  ActionTaskModelEnum,
  ActionTaskStatus,
} from "@/types";

class ActionTaskRepository extends BaseRepository<ActionTaskAttribute> {
  protected model: ActionTaskModel;
  protected DEFAULT_ATTRIBUTE: Partial<ActionTaskAttribute> = {
    model_name: ActionTaskModelEnum.inquiry,
    model_id: "",
    status: ActionTaskStatus["To-Do-List"],
    created_at: "",
    common_type_id: "",
    updated_at: null,
    created_by: "",
  };
  constructor() {
    super();
    this.model = new ActionTaskModel();
  }

  public async getListActionTask(modelName: string, modelId: string) {
    return this.model
      .getQuery()
      .select([
        "actions_tasks.*",
        "common_types.name as action_name",
        "users.firstname as firstname",
        "users.lastname as lastname",
      ])
      .where("actions_tasks.model_name", "==", modelName)
      .where("actions_tasks.model_id", "==", modelId)
      .join(
        "common_types",
        "common_types.id",
        "==",
        "actions_tasks.common_type_id"
      )
      .join("users", "users.id", "==", "actions_tasks.created_by")
      .get();
  }
}
export const actionTaskRepository = new ActionTaskRepository();
export default ActionTaskRepository;
