import Model from "@/Database/Model";
import { IBasisAttributes } from "@/types/basis.type";

export default class BasisModel extends Model<IBasisAttributes> {
  protected table = "bases";
  protected softDelete = true;
}
