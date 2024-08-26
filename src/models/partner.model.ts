import Model from "@/Database/Model";
import { PartnerAttributes } from "@/types/partner.type";

export default class PartnerModel extends Model<PartnerAttributes> {
  protected table = "partners";
  protected softDelete = true;
}
