import { ENVIRONMENT } from "@/config";
import Bull from "bull";
import { mailService } from "@/services/mail.service";
import { BaseQueue } from "./base.queue";
import { invoiceRepository } from "@/repositories/invoice.repository";
import moment from "moment";
import { invoiceService } from "@/api/invoice/invoice.service";
import _ from "lodash";
import fs from "fs";
import path from "path";

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
        var tempDir =
          path.resolve("") + `/logs/${moment().format("YYYYMMDD_HHmmss")}`;

        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }
        const invoices = await invoiceRepository.getUnpaidInvoices();
        fs.writeFileSync(
          `${tempDir}/unpaid.txt`,
          JSON.stringify(invoices.map((item) => item.id))
        );
        let dataToLog: any = [];
        await Promise.all(
          invoices.map(async (invoice) => {
            if (_.isEmpty(invoice.due_date)) {
              return true;
            }
            const diff = moment().diff(moment(invoice.due_date), "days");
            const pdfBuffer: any = await invoiceService.getInvoicePdf(
              invoice.id
            );
            dataToLog.push({
              email: invoice.ordered_user.email,
              firstname: invoice.ordered_user.firstname,
              diff,
              is_sent: diff % ENVIRONMENT.AUTO_BILLING_SYSTEM_PERIOD === 0,
              email_type: diff > 0 ? "overdue" : "reminder",
            });
            if (diff % ENVIRONMENT.AUTO_BILLING_SYSTEM_PERIOD === 0) {
              mailService.sendInvoiceReminder(
                invoice.ordered_user.email,
                invoice.ordered_user.firstname,
                pdfBuffer.data.toString("base64"),
                `${invoice.name}.pdf`,
                diff > 0
              );
            } else if (diff === 1) {
              mailService.sendInvoiceReminder(
                invoice.ordered_user.email,
                invoice.ordered_user.firstname,
                pdfBuffer.data.toString("base64"),
                `${invoice.name}.pdf`,
                true
              );
            }
            return true;
          })
        );
        fs.writeFileSync(`${tempDir}/mail.txt`, JSON.stringify(dataToLog));
        done();
      } catch (error: any) {
        this.log(error, "slack");
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
    this.queue.add(
      {},
      { repeat: { cron: ENVIRONMENT.INVOICE_EMAIL_CRON_EXPRESSION } }
    );
  };
}

export const invoiceEmailQueue = new InvoiceEmailQueue();
