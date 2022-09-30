import Model from "@/Database/Model";
import { ILocationAttributes } from "@/types";


export default class LocationModel extends Model<ILocationAttributes> {
  protected table = "locations";
  protected softDelete = true;
}
