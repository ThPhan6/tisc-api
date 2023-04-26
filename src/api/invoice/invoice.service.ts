import {
  COMMON_TYPES,
  DefaultCurrency,
  MESSAGES,
  SupportedCurrency,
} from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
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
import {
  GetListInvoiceSorting,
  InvoiceRequestCreate,
  InvoiceRequestUpdate,
  PaymentIntentAttributes,
} from "./invoice.type";
import {
  calculateInterestInvoice,
  pagination,
  toFixedNumber,
  toNonAccentUnicode,
  toUSMoney,
} from "@/helpers/common.helper";
import moment from "moment";
import { mailService } from "@/services/mail.service";
import { pdfService } from "@/api/pdf/pdf.service";
import { airwallexService } from "@/services/airwallex.service";
import { paymentRepository } from "@/repositories/payment.repository";
import { userRepository } from "@/repositories/user.repository";
import { ENVIRONMENT } from "@/config";
import { locationRepository } from "@/repositories/location.repository";
import { freeCurrencyService } from "@/services/free_currency.service";

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
  private getOverDueDays = (
    invoice: InvoiceWithRelations | InvoiceWithUserAndServiceType
  ) => {
    let diff: number;
    if (invoice.payment_date && invoice.payment_date !== "") {
      diff = moment(invoice.payment_date).diff(
        moment(invoice.due_date),
        "days"
      );
    } else {
      diff = moment().diff(moment(invoice.due_date), "days");
    }
    return diff > 0 ? diff : 0;
  };
  private calculateInvoice = (
    invoice: InvoiceWithRelations | InvoiceWithUserAndServiceType
  ) => {
    const overdueDays = this.getOverDueDays(invoice);
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
      status:
        overdueDays && invoice.status === InvoiceStatus.Outstanding
          ? InvoiceStatus.Overdue
          : invoice.status,
    };
  };
  private getBillingNumber = (
    brandName: string,
    serviceType: string,
    created_at: string
  ) =>
    `${toNonAccentUnicode(brandName).replace(
      /\s/g,
      ""
    )}-${this.getServiceTypeCode(serviceType)}${moment(created_at).format(
      "YYYYMMDD"
    )}`;

  private getServiceTypeCode = (serviceType: string) => {
    switch (true) {
      case serviceType == "Offline Marketing & Sales":
        return "OF";
      case serviceType == "Online Marketing & Sales":
        return "ON";
      case serviceType == "Product Card Conversion":
        return "PC";
      default:
        return "OT";
    }
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
    const createdInvoice = await invoiceRepository.create({
      name: this.getBillingNumber(
        brand.name,
        serviceType.name,
        new Date().toString()
      ),
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
      `${invoice.name}.pdf`,
      user.email
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
    sort: GetListInvoiceSorting,
    order: SortOrder
  ) {
    const { invoices, total } =
      await invoiceRepository.getWithUserAndServiceType(
        limit,
        offset,
        sort,
        order,
        user.type === UserType.TISC ? undefined : user.relation_id
      );
    return successResponse({
      data: {
        data: invoices.map((item) => this.calculateInvoice(item)),
        pagination: pagination(limit, offset, total),
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

    let relation_id = payload.brand_id || invoice.relation_id;
    const brand = await brandRepository.find(relation_id);
    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND);
    }

    let service_type_id = payload.service_type_id || invoice.service_type_id;
    const serviceType = await commonTypeRepository.findOrCreate(
      service_type_id,
      "TISC",
      COMMON_TYPES.INVOICE
    );
    if (!serviceType) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }
    service_type_id = serviceType.id;

    const billingNumberChange =
      (payload.brand_id && payload.brand_id !== invoice.relation_id) ||
      (payload.service_type_id &&
        payload.service_type_id !== invoice.service_type_id);
    await invoiceRepository.update(id, {
      ...payload,
      relation_id,
      service_type_id,
      name: billingNumberChange
        ? this.getBillingNumber(
            brand.name,
            serviceType.name,
            invoice.created_at
          )
        : invoice.name,
    });
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }
  public async delete(invoiceId: string) {
    const invoice = await invoiceRepository.find(invoiceId);
    if (!invoice) {
      return errorMessageResponse(MESSAGES.INVOICE.NOT_FOUND, 404);
    }
    if (invoice.status !== InvoiceStatus.Pending) {
      return errorMessageResponse(MESSAGES.INVOICE.ONLY_UPDATE_PENDING_INVOICE);
    }
    const response = await invoiceRepository.delete(invoiceId);
    if (!response) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_DELETE);
    }
    return successResponse({ data: response });
  }

  public async sendReminder(invoiceId: string, user: UserAttributes) {
    const invoice = await invoiceRepository.findInvoiceWithRelations(invoiceId);
    if (!invoice) {
      return errorMessageResponse(MESSAGES.INVOICE.NOT_FOUND, 404);
    }
    const pdfBuffer: any = await this.getInvoicePdf(invoiceId);

    const diff = moment().diff(moment(invoice.due_date), "days");
    const isOverdue = invoice.status === InvoiceStatus.Outstanding && diff > 0;
    const sent = await mailService.sendInvoiceReminder(
      invoice.ordered_user.email,
      invoice.ordered_user.firstname,
      pdfBuffer.data.toString("base64"),
      `${invoice.name}.pdf`,
      isOverdue,
      user.email
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
      !invoice.payment_date || invoice.payment_date === ""
        ? "Invoice"
        : "Receipt",
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
        quantity: toUSMoney(calculatedInvoice.quantity).slice(1, -3),
      }
    );
    return successResponse({ data: result, fileName: invoice.name });
  }
  public createPaymentIntent = async (
    invoiceId: string,
    user: UserAttributes
  ) => {
    const invoice: any = await this.get(user, invoiceId);
    if (!invoice) {
      return errorMessageResponse(MESSAGES.INVOICE.NOT_FOUND, 404);
    }
    if (invoice.data.status === InvoiceStatus.Paid) {
      return errorMessageResponse(MESSAGES.INVOICE.PAID);
    }
    const exchanges = await freeCurrencyService.exchange();
    const exchange = exchanges.data["SGD"];
    const grandTotalSGD = toFixedNumber(
      invoice.data.total_gross * exchange * (1 + ENVIRONMENT.SURCHARGE_RATE),
      2
    );
    const exchangedMoney = {
      [`amount_sgd`]: invoice.data.total_gross * exchange,
      [`surcharge_sgd`]:
        invoice.data.total_gross * exchange * ENVIRONMENT.SURCHARGE_RATE,
      [`grand_total_sgd`]: grandTotalSGD,
      [`amount_usd`]: invoice.data.total_gross,
      [`surcharge_usd`]: invoice.data.total_gross * ENVIRONMENT.SURCHARGE_RATE,
      [`grand_total_usd`]: toFixedNumber(
        invoice.data.total_gross * (1 + ENVIRONMENT.SURCHARGE_RATE),
        2
      ),
    };
    const result = (await airwallexService.createPaymentIntent({
      amount: grandTotalSGD,
      currency: "SGD",
      metadata: {
        invoice_id: invoice.data.id,
        created_by: user.id,
        ...exchangedMoney,
      },
    })) as PaymentIntentAttributes;
    await paymentRepository.create({
      intent_id: result.id,
      invoice_id: invoiceId,
      created_by: user.id,
      status: result.status,
    });
    return successResponse({ data: result });
  };
  private sendPaymentReceivedEmailToAdmin = async (options: {
    invoice_id: string;
    billing_number: string;
    amount: number;
    payment_user_id: string;
  }) => {
    const invoice = await invoiceRepository.findInvoiceWithRelations(
      options.invoice_id
    );
    if (!invoice) {
      return;
    }
    const paymentUser = await userRepository.find(options.payment_user_id);
    if (!paymentUser) {
      return;
    }
    await mailService.sendInvoicePaymentReceived(
      invoice.created_user.email,
      paymentUser.firstname,
      paymentUser.lastname,
      invoice.brand_name,
      options.billing_number,
      options.amount
    );
  };

  private sendPaymentSuccessEmailToPaymentUser = async (options: {
    payment_user_id: string;
    invoice_id: string;
  }) => {
    const paymentUser = await userRepository.find(options.payment_user_id);
    if (!paymentUser) {
      return;
    }
    await mailService.sendInvoicePaymentSuccess(
      paymentUser.email,
      paymentUser.firstname,
      `${ENVIRONMENT.FE_URL}/brand/adminstration/billed-services/${options.invoice_id}`
    );
  };

  public receivePaymentInfo = async (payload: any) => {
    console.log(payload.name, payload.sourceId);
    try {
      const payment = await paymentRepository.findBy({
        intent_id: payload.sourceId,
      });
      if (!payment) {
        return successMessageResponse(MESSAGES.SUCCESS);
      }
      const invoice = await invoiceRepository.find(payment.invoice_id);
      if (!invoice) {
        return successMessageResponse(MESSAGES.SUCCESS);
      }
      if (payload && payload.name === "payment_intent.succeeded") {
        await invoiceRepository.update(invoice.id, {
          status: InvoiceStatus.Processing,
        });
      }
      if (payload && payload.name === "payment_attempt.capture_failed") {
        const diff = moment().diff(moment(invoice.due_date), "days");
        await invoiceRepository.update(invoice.id, {
          status: diff > 0 ? InvoiceStatus.Overdue : InvoiceStatus.Outstanding,
        });
      }
      if (payload && payload.name === "payment_attempt.paid") {
        await invoiceRepository.update(invoice.id, {
          status: InvoiceStatus.Paid,
        });
        //send email to TISC
        await this.sendPaymentReceivedEmailToAdmin({
          invoice_id: invoice.id,
          billing_number: invoice.name,
          payment_user_id: payload.data.object.metadata.created_by,
          amount: payload.data.object.amount,
        });
        //send receipt to created_by
        await this.sendPaymentSuccessEmailToPaymentUser({
          payment_user_id: payload.data.object.metadata.created_by,
          invoice_id: invoice.id,
        });
      }
      return successMessageResponse(MESSAGES.SUCCESS);
    } catch (error) {
      return successMessageResponse(MESSAGES.SUCCESS);
    }
  };
}
export const invoiceService = new InvoiceService();
export default InvoiceService;
