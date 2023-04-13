import Model from "@/Database/Model";

export interface PaymentAttributes {
  id: string;
  intent_id: string;
  status: string;
  invoice_id: string;
  created_by: string;
  created_at: string;
}

export default class PaymentModel extends Model<PaymentAttributes> {
  protected table = "payments";
  protected softDelete = false;
}
