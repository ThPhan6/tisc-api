import BaseRepository from "./base.repository";
import StepSelectionModel from "@/models/step_selection.model";
import { StepSelectionAttribute } from "@/types";

class StepSelectionRepository extends BaseRepository<StepSelectionAttribute> {
  protected model: StepSelectionModel;

  constructor() {
    super();
    this.model = new StepSelectionModel();
  }
}

export default new StepSelectionRepository();
export const stepSelectionRepository = new StepSelectionRepository();
