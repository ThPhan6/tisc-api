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
import { userRepository } from "@/repositories/user.repository";
import { brandRepository } from "@/repositories/brand.repository";
import { InvoiceRequestCreate, InvoiceRequestUpdate } from "./invoice.type";
import {
  calculateInterestInvoice,
  toNonAccentUnicode,
} from "@/helper/common.helper";
import moment from "moment";
import { mailService } from "@/service/mail.service";

class InvoiceService {
  private calculateBillingAmount = (
    quantity: number,
    unit_rate: number,
    tax: number
  ) => {
    const totalGross = quantity * unit_rate;
    const saleTaxAmount = (tax / 100) * totalGross;
    return totalGross + saleTaxAmount;
  };
  private calculateInvoice = (invoice: InvoiceWithUserAndServiceType) => {
    const diff = moment().diff(moment(invoice.due_date), "days");
    const overdueDays = diff > 0 ? diff : 0;
    const billingAmount = this.calculateBillingAmount(
      invoice.quantity,
      invoice.unit_rate,
      invoice.tax
    );
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
      remark: payload.remark,
      created_by: user.id,
      status: InvoiceStatus.Pending,
    });

    if (!createdInvoice) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
    }
    const receiver = await userRepository.find(payload.ordered_by);

    const billingAmount = this.calculateBillingAmount(
      payload.quantity,
      payload.unit_rate,
      payload.tax
    );
    await mailService.sendInvoiceCreated(
      receiver?.email || "",
      receiver?.firstname || "",
      billingAmount
    );
    return this.get(user, createdInvoice.id);
  }
  public async bill(user: UserAttributes, invoiceId: string) {
    const invoice = await invoiceRepository.find(invoiceId);

    if (!invoice) {
      return errorMessageResponse(MESSAGES.INVOICE.NOT_FOUND, 404);
    }
    if (invoice.status !== InvoiceStatus.Pending) {
      return errorMessageResponse(MESSAGES.INVOICE.ONLY_BILL_PENDING_INVOICE);
    }
    await invoiceRepository.update(invoiceId, {
      due_date: moment().add(7, "days").format("YYYY-MM-DD"),
      status: InvoiceStatus.Outstanding,
    });
    return this.get(user, invoiceId);
  }
  public async paid(user: UserAttributes, invoiceId: string) {
    const invoice = await invoiceRepository.find(invoiceId);

    if (!invoice) {
      return errorMessageResponse(MESSAGES.INVOICE.NOT_FOUND, 404);
    }
    if (
      invoice.status !== InvoiceStatus.Outstanding &&
      invoice.status !== InvoiceStatus.Overdue
    ) {
      return errorMessageResponse(
        MESSAGES.INVOICE.ONLY_PAID_OUTSTANDING_OR_OVERDUE
      );
    }
    await invoiceRepository.update(invoiceId, {
      status: InvoiceStatus.Paid,
    });
    return this.get(user, invoiceId);
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
  public async get(user: UserAttributes, invoiceId: string) {
    const invoice = await invoiceRepository.findWithUserAndServiceType(
      invoiceId
    );
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
    const invoice = await invoiceRepository.find(id);

    if (!invoice) {
      return errorMessageResponse(MESSAGES.INVOICE.NOT_FOUND, 404);
    }
    if (invoice.status !== InvoiceStatus.Pending) {
      return errorMessageResponse(MESSAGES.INVOICE.ONLY_UPDATE_PENDING_INVOICE);
    }
    await invoiceRepository.update(id, payload);
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }

  public async sendReminder(invoiceId: string) {
    const invoice = await invoiceRepository.find(invoiceId);
    if (!invoice) {
      return errorMessageResponse(MESSAGES.INVOICE.NOT_FOUND, 404);
    }
    const user = await userRepository.find(invoice.ordered_by);
    const sent = await mailService.sendInvoiceReminder(
      user?.email || "",
      user?.firstname || ""
    );
    if (!sent) {
      return errorMessageResponse(MESSAGES.SEND_EMAIL_WRONG);
    }
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }
}
export const invoiceService = new InvoiceService();
export default InvoiceService;
