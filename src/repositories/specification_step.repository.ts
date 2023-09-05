import BaseRepository from "./base.repository";
import SpecificationStepModel from "@/models/specification_step.model";
import { SpecificationStepAttribute } from "@/types";

class SpecificationStepRepository extends BaseRepository<SpecificationStepAttribute> {
  protected model: SpecificationStepModel;

  constructor() {
    super();
    this.model = new SpecificationStepModel();
  }
}

export default new SpecificationStepRepository();
export const specificationStepRepository = new SpecificationStepRepository();
