import ActionTaskModel from "@/model/action_task.model";
import BaseRepository from "@/repositories/base.repository";
import { ActionTaskAttribute } from "@/types/action_task.type";
import { ActionTaskStatus } from "./../types/action_task.type";
class ActionTaskRepository extends BaseRepository<ActionTaskAttribute> {
  protected model: ActionTaskModel;
  protected DEFAULT_ATTRIBUTE: Partial<ActionTaskAttribute> = {
    model_name: "",
    model_id: "",
    status: ActionTaskStatus.To_do_list,
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
    const params = {
      modelName,
      modelId,
    };
    const rawQuery = `
    FILTER actions_tasks.deleted_at == null
    FILTER actions_tasks.model_name == @modelName
    FILTER actions_tasks.model_id == @modelId
    LET actionTask = (
        FOR common_types IN common_types
        FILTER actions_tasks.common_type_id == common_types.id
        RETURN common_types
    )
    LET teams = (
        FOR users IN users
        FILTER users.id == actions_tasks.created_by
        RETURN {
            id : users.id,
            fistname : users.firstname,
            lastname :users.lastname
        }
    )
    
    FOR actions IN actionTask
    RETURN {
        id : actions_tasks.id,
        created_at : actions_tasks.created_at,
        actions : actions.name,
        teams : teams[0],
        status :  actions_tasks.status
    }
    `;

    return this.model.rawQuery(rawQuery, params);
  }
}
export const actionTaskRepository = new ActionTaskRepository();
export default ActionTaskRepository;
