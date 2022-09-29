import { IDistributorAttributes } from "@/types";
import Model from "@/Database/Model";
export default class DistributorModel extends Model<IDistributorAttributes> {
  protected table = "distributors";
  protected softDelete = true;
}
