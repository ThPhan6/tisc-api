import { COMMON_TYPES, MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import {
  invoiceRepository,
  InvoiceWithUserAndServiceType,
} from "@/repositories/invoice.repository";
import { SortOrder, UserAttributes } from "@/types";

import { commonTypeRepository } from "@/repositories/common_type.repository";
import { InvoiceRequestCreate, InvoiceRequestUpdate } from "./invoice.type";
import { getDiff } from "@/Database/Utils/Time";
import moment from "moment";

class InvoiceService {
  private calculatedInvoice = (invoice: InvoiceWithUserAndServiceType) => {
    const overdueDays =
      getDiff(moment(), moment(invoice.due_date), "days") || 0;
    let overdueAmount = 0;
    if (overdueDays > 0) {
      overdueAmount = invoice.billing_amount * invoice.unit_rate * overdueDays;
    }
    return {
      ...invoice,
      overdue_days: overdueDays,
      overdue_amount: overdueAmount,
    };
  };
  public async create(user: UserAttributes, payload: InvoiceRequestCreate) {
    const serviceType = await commonTypeRepository.findOrCreate(
      payload.service_type_id,
      "TISC",
      COMMON_TYPES.INVOICE
    );
    const createdInvoice = await invoiceRepository.create({
      service_type_id: serviceType.id,
      brand_id: payload.brand_id,
      ordered_by: payload.ordered_by,
      unit_rate: payload.unit_rate,
      quantity: payload.quantity,
      tax: payload.tax,
      billing_amount: payload.billing_amount,
      due_date: payload.due_date,
      remark: payload.remark,
      created_by: user.id,
    });

    if (!createdInvoice) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
    }

    return successResponse({ data: createdInvoice });
  }

  public async getList(
    limit: number,
    offset: number,
    sort: string,
    order: SortOrder
  ) {
    const invoices = await invoiceRepository.getWithUserAndServiceType(
      limit,
      offset,
      sort,
      order
    );
    return successResponse({
      data: {
        ...invoices,
        data: invoices.data.map((item) => this.calculatedInvoice(item)),
      },
    });
  }
  public async get(id: string) {
    const invoice = await invoiceRepository.findWithUserAndServiceType(id);
    return successResponse({
      data: this.calculatedInvoice(invoice),
    });
  }

  public async update(id: string, payload: InvoiceRequestUpdate) {
    const updated = await invoiceRepository.findAndUpdate(id, payload);

    if (!updated) {
      return errorMessageResponse(MESSAGES.INVOICE.NOT_FOUND, 404);
    }

    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }
}
export const invoiceService = new InvoiceService();
export default InvoiceService;
