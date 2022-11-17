import Model from "@/Database/Model";
import { InvoiceAttributes } from "@/types";

export default class InvoiceModel extends Model<InvoiceAttributes> {
  protected table = "invoices";
  protected softDelete = true;
}
