import Model from "@/Database/Model";
import { ILabelAttributes } from "@/types/label.type";

export default class LabelModel extends Model<ILabelAttributes> {
  protected table = "labels";
  protected softDelete = true;
}
