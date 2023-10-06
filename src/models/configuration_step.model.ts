import Model from "@/Database/Model";
import { ConfigurationStepAttribute } from "@/types";

export default class ConfigurationStepModel extends Model<ConfigurationStepAttribute> {
  protected table = "configuration_steps";
  protected softDelete = true;
}
