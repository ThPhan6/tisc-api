import Model from "@/Database/Model";
import { DefaultPreSelectionAttribute } from "@/types";

export default class DefaultPreSelectionModel extends Model<DefaultPreSelectionAttribute> {
  protected table = "default_pre_selections";
  protected softDelete = true;
}
