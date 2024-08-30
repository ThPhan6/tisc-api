import { PartnerContactAttributes } from "@/api/partner_contact/partner_contact.type";
import Model from "@/Database/Model";

export default class PartnerContactModel extends Model<PartnerContactAttributes> {
  protected table = "partner_contacts";
  protected softDelete = true;
}
