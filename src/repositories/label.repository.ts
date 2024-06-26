import LabelModel from "@/models/label.model";
import { ILabelAttributes } from "@/types";
import BaseRepository from "./base.repository";

class LabelRepository extends BaseRepository<ILabelAttributes> {
  protected model: LabelModel;
  protected DEFAULT_ATTRIBUTE: Partial<ILabelAttributes> = {
    name: "",
  };
  constructor() {
    super();
    this.model = new LabelModel();
  }
}
export default new LabelRepository();
export const labelRepository = new LabelRepository();
