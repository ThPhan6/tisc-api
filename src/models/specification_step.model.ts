import Model from "@/Database/Model";
import { SpecificationStepAttribute } from "@/types";

export default class SpecificationStepModel extends Model<SpecificationStepAttribute> {
  protected table = "specification_steps";
  protected softDelete = true;
}
