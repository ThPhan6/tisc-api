import Model from "@/Database/Model";
import { StepSelectionAttribute } from "@/types";

export default class StepSelectionModel extends Model<StepSelectionAttribute> {
  protected table = "step_selections";
  protected softDelete = true;
}
