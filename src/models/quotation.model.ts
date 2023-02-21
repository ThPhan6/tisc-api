import Model from "@/Database/Model";
import { IQuotationAttributes } from "@/types/quotation.type";

export default class QuotationModel extends Model<IQuotationAttributes> {
  protected table = "inspirational_quotations";
  protected softDelete = true;
}
