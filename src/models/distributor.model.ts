import Model from "@/Database/Model";
import { IDistributorAttributes } from "@/types";

export default class DistributorModel extends Model<IDistributorAttributes> {
  protected table = "distributors";
  protected softDelete = true;
}
