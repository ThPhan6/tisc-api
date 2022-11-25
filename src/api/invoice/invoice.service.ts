import { COMMON_TYPES, MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import {
  invoiceRepository,
  InvoiceWithRelations,
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
  toUSMoney,
} from "@/helper/common.helper";
import moment from "moment";
import { mailService } from "@/service/mail.service";
import { pdfService } from "@/api/pdf/pdf.service";
import { ENVIROMENT } from "@/config";

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
  private calculateInvoice = (
    invoice: InvoiceWithRelations | InvoiceWithUserAndServiceType
  ) => {
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
      total_gross: totalGross,
      sale_tax_amount: saleTaxAmount,
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
    return this.get(user, createdInvoice.id);
  }
  public async bill(user: UserAttributes, invoiceId: string) {
    const invoice = await invoiceRepository.findInvoiceWithRelations(invoiceId);

    if (!invoice) {
      return errorMessageResponse(MESSAGES.INVOICE.NOT_FOUND, 404);
    }
    if (invoice.status !== InvoiceStatus.Pending) {
      return errorMessageResponse(MESSAGES.INVOICE.ONLY_BILL_PENDING_INVOICE);
    }
    await invoiceRepository.update(invoiceId, {
      due_date: moment().add(7, "days").format("YYYY-MM-DD"),
      billed_date: moment().format("YYYY-MM-DD"),
      status: InvoiceStatus.Outstanding,
    });

    const billingAmount = this.calculateBillingAmount(
      invoice.quantity,
      invoice.unit_rate,
      invoice.tax
    );
    const pdfBuffer: any = await this.getInvoicePdf(invoiceId);
    await mailService.sendInvoiceCreated(
      invoice.ordered_user.email,
      invoice.ordered_user.firstname,
      billingAmount,
      pdfBuffer.data.toString("base64"),
      `${invoice.name}.pdf`
    );
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
      payment_date: moment().format("YYYY-MM-DD"),
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
    const invoice = await invoiceRepository.findInvoiceWithRelations(invoiceId);
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
  public async delete(invoiceId: string) {
    await invoiceRepository.findAndDelete(invoiceId);
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }

  public async sendReminder(invoiceId: string) {
    const invoice = await invoiceRepository.findInvoiceWithRelations(invoiceId);
    if (!invoice) {
      return errorMessageResponse(MESSAGES.INVOICE.NOT_FOUND, 404);
    }
    const pdfBuffer: any = await this.getInvoicePdf(invoiceId);
    const sent = await mailService.sendInvoiceReminder(
      invoice.ordered_user.email,
      invoice.ordered_user.firstname,
      pdfBuffer.data.toString("base64"),
      `${invoice.name}.pdf`
    );
    if (!sent) {
      return errorMessageResponse(MESSAGES.SEND_EMAIL_WRONG);
    }
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }
  public async getInvoicePdf(invoiceId: string) {
    const invoice = await invoiceRepository.findInvoiceWithRelations(invoiceId);
    if (!invoice) {
      return errorMessageResponse(MESSAGES.INVOICE.NOT_FOUND, 404);
    }
    const calculatedInvoice = this.calculateInvoice(invoice);
    const result = await pdfService.generateInvoicePdf(
      invoice.payment_date === "" ? "Invoice" : "Receipt",
      {
        ...calculatedInvoice,
        bill_number: invoice.name.slice(-10),
        billed_date: invoice.billed_date || "",
        payment_date:
          !invoice.payment_date || invoice.payment_date === ""
            ? "pending"
            : invoice.payment_date,
        ...invoice.ordered_user.location,
        unit_rate: toUSMoney(calculatedInvoice.unit_rate),
        overdue_amount: toUSMoney(calculatedInvoice.overdue_amount),
        total_gross: toUSMoney(calculatedInvoice.total_gross),
        sale_tax_amount: toUSMoney(calculatedInvoice.sale_tax_amount),
        total_amount: toUSMoney(
          calculatedInvoice.total_gross + calculatedInvoice.sale_tax_amount
        ),
        billing_amount: toUSMoney(
          calculatedInvoice.billing_amount + calculatedInvoice.overdue_amount
        ),
      },
      {
        address: `${invoice.created_user.location.address} ${invoice.created_user.location.city_name}, ${invoice.created_user.location.state_name}, ${invoice.created_user.location.city_name} ${invoice.created_user.location.postal_code}`,
        email: invoice.created_user.email,
        website: ENVIROMENT.TISC_WEBSITE,
      }
    );
    return successResponse({ data: result, fileName: invoice.name });
  }
}
export const invoiceService = new InvoiceService();
export default InvoiceService;
