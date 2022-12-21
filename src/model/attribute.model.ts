import Model from "@/Database/Model";
import { AttributeProps } from "@/types/attribute.type";

export default class AttributeModel extends Model<AttributeProps> {
  protected table = "attributes";
  protected softDelete = true;
}
