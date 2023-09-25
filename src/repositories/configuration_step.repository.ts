import BaseRepository from "./base.repository";
import ConfigurationStepModel from "@/models/configuration_step.model";
import { ConfigurationStepAttribute } from "@/types";

class ConfigurationStepRepository extends BaseRepository<ConfigurationStepAttribute> {
  protected model: ConfigurationStepModel;

  constructor() {
    super();
    this.model = new ConfigurationStepModel();
  }

  public getMany = (stepIds: string[], projectId?: string, userId?: string) => {
    let result = this.model.select().whereIn("step_id", stepIds);
    if (projectId) {
      result = result.where("project_id", "==", projectId);
    }
    if (userId) {
      result = result.where("user_id", "==", userId);
    }
    return result.get();
  };
}

export default new ConfigurationStepRepository();
export const configurationStepRepository = new ConfigurationStepRepository();
