import BaseRepository from "./base.repository";
import ConfigurationStepModel from "@/models/configuration_step.model";
import { ConfigurationStepAttribute } from "@/types";

class ConfigurationStepRepository extends BaseRepository<ConfigurationStepAttribute> {
  protected model: ConfigurationStepModel;

  constructor() {
    super();
    this.model = new ConfigurationStepModel();
  }

  public getMany = (stepIds: string[]) => {
    return this.model.select().whereIn("step_id", stepIds).get();
  };
}

export default new ConfigurationStepRepository();
export const configurationStepRepository = new ConfigurationStepRepository();
