import Model from "@/Database/Model";
import { ICollectionAttributes } from "@/types/collection.type";

export default class CollectionModel extends Model<ICollectionAttributes> {
  protected table = "collections";
  protected softDelete = true;
}
