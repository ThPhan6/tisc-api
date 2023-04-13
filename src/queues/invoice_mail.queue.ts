import { ENVIRONMENT } from "@/config";
import Bull from "bull";
import { mailService } from "@/services/mail.service";
import { BaseQueue } from "./base.queue";
import { invoiceRepository } from "@/repositories/invoice.repository";
import moment from "moment";
import { invoiceService } from "@/api/invoice/invoice.service";
import _ from "lodash";

class InvoiceEmailQueue extends BaseQueue {
  constructor() {
    super(
      new Bull(
        "Invoice_email_queue",
        `redis://${ENVIRONMENT.REDIS_HOST}:${ENVIRONMENT.REDIS_PORT}`
      )
    );
  }

  public process = () => {
    this.queue.process(async (job, done) => {
      try {
        const invoices = await invoiceRepository.getUnpaidInvoices();
        await Promise.all(
          invoices.map(async (invoice) => {
            if (_.isEmpty(invoice.due_date)) {
              return true;
            }
            const diff = moment().diff(moment(invoice.due_date), "days");
            const pdfBuffer: any = await invoiceService.getInvoicePdf(
              invoice.id
            );
            if (diff % 7 === 0) {
              mailService.sendInvoiceReminder(
                invoice.ordered_user.email,
                invoice.ordered_user.firstname,
                pdfBuffer.data.toString("base64"),
                `${invoice.name}.pdf`,
                diff > 0
              );
            }
            return true;
          })
        );
        done();
      } catch (error: any) {
        this.log(
          {
            subject: job.data.subject,
            to: job.data.to,
            from: job.data.from,
            message: error.stack || "",
          },
          "log_collections"
        );
      }
    });
  };
  public add = () => {
    this.queue.add({}, { repeat: { cron: ENVIRONMENT.INVOICE_EMAIL_CRON_EXPRESSION } });
  };
}

export const invoiceEmailQueue = new InvoiceEmailQueue();
