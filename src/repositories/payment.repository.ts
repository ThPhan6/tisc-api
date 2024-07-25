import PaymentModel, { PaymentAttributes } from "@/models/payments.model";
import BaseRepository from "./base.repository";

class PaymentRepository extends BaseRepository<PaymentAttributes> {
  protected model: PaymentModel;
  protected DEFAULT_ATTRIBUTE: Partial<PaymentAttributes> = {
    id: "",
    invoice_id: "",
    intent_id: "",
  };

  constructor() {
    super();
    this.model = new PaymentModel();
  }

  public async findLastIntent(invoiceId: string, userId: string) {
    return (await this.model
      .where("invoice_id", "==", invoiceId)
      .where("created_by", "==", userId)
      .order("created_at", "DESC")
      .first()) as any;
  }
}

export default PaymentRepository;
export const paymentRepository = new PaymentRepository();
