import Model from "@/Database/Model";
import { IAttributeAttributes } from "@/types/attribute.type";

export default class AttributeModel extends Model<IAttributeAttributes> {
  protected table = "attributes";
  protected softDelete = true;
}
