import Model from "@/Database/Model";
import { GeneralInquiryAttribute } from "@/types";

export default class GeneralInquiryModel extends Model<GeneralInquiryAttribute> {
  protected table = "general_inquiries";
  protected softDelete = true;
}
