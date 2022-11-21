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
import {
  SortOrder,
  UserAttributes,
  UserType,
  InvoiceCompanyType,
  InvoiceStatus,
} from "@/types";

import { commonTypeRepository } from "@/repositories/common_type.repository";
import { brandRepository } from "@/repositories/brand.repository";
import { InvoiceRequestCreate, InvoiceRequestUpdate } from "./invoice.type";
import {
  calculateInterestInvoice,
  toNonAccentUnicode,
} from "@/helper/common.helper";
import moment from "moment";

class InvoiceService {
  private calculateInvoice = (invoice: InvoiceWithUserAndServiceType) => {
    const diff = moment().diff(moment(invoice.due_date), "days");
    const overdueDays = diff > 0 ? diff : 0;
    const totalGross = invoice.quantity * invoice.unit_rate;
    const saleTaxAmount = (invoice.tax / 100) * totalGross;
    const billingAmount = totalGross + saleTaxAmount;
    let overdueAmount = calculateInterestInvoice(billingAmount, overdueDays);
    return {
      ...invoice,
      billing_amount: billingAmount,
      overdue_days: overdueDays,
      overdue_amount: overdueAmount,
    };
  };
  public async create(user: UserAttributes, payload: InvoiceRequestCreate) {
    const brand = await brandRepository.find(payload.brand_id);
    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND);
    }
    //
    const serviceType = await commonTypeRepository.findOrCreate(
      payload.service_type_id,
      "TISC",
      COMMON_TYPES.INVOICE
    );
    //
    const now = moment();
    const createdInvoice = await invoiceRepository.create({
      name: `${toNonAccentUnicode(brand.name)}-PC${now.format("YYYYMMDD")}`,
      service_type_id: serviceType.id,
      relation_id: brand.id,
      relation_type: InvoiceCompanyType.Brand,
      ordered_by: payload.ordered_by,
      unit_rate: payload.unit_rate,
      quantity: payload.quantity,
      tax: payload.tax,
      due_date: now.add(7, "days").format("YYYY-MM-DD"),
      remark: payload.remark,
      created_by: user.id,
      status: InvoiceStatus.Outstanding
    });

    if (!createdInvoice) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
    }

    return this.get(user, createdInvoice.id);
  }

  public async getInvoiceSummary() {
    const summary = await invoiceRepository.summary();
    return successResponse({ data: summary });
  }

  public async getList(
    user: UserAttributes,
    limit: number,
    offset: number,
    sort: string,
    order: SortOrder
  ) {
    const invoices = await invoiceRepository.getWithUserAndServiceType(
      limit,
      offset,
      sort,
      order,
      user.type === UserType.TISC ? undefined : user.relation_id
    );
    return successResponse({
      data: {
        ...invoices,
        data: invoices.data.map((item) => this.calculateInvoice(item)),
      },
    });
  }
  public async get(user: UserAttributes, id: string) {
    const invoice = await invoiceRepository.findWithUserAndServiceType(id);
    if (
      !invoice ||
      (user.type !== UserType.TISC && invoice.relation_id !== user.relation_id)
    ) {
      return errorMessageResponse(MESSAGES.INVOICE.NOT_FOUND);
    }

    return successResponse({
      data: this.calculateInvoice(invoice),
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
