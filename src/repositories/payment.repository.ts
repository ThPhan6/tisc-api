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
}

export default PaymentRepository;
export const paymentRepository = new PaymentRepository();
