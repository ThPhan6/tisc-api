import { ENVIRONMENT } from "@/config";
import Bull from "bull";
import { mailService } from "@/services/mail.service";
import { TransactionEmailPayload } from "@/types";
import { BaseQueue } from "./base.queue";
import { v4 as uuid } from "uuid";
class EmailQueue extends BaseQueue {
  constructor() {
    super(
      new Bull(
        "Email_queue",
        `redis://${ENVIRONMENT.REDIS_HOST}:${ENVIRONMENT.REDIS_PORT}`
      )
    );
  }

  public process = () => {
    this.queue.process(async (job, done) => {
      try {
        let data: Omit<TransactionEmailPayload, "sender"> = {
          to: [{ email: job.data.email }],
          subject: job.data.subject,
          htmlContent: job.data.html,
        };
        if (job.data.attachment) {
          data = {
            ...data,
            attachment: job.data.attachment,
          };
        }
        await mailService.sendTransactionEmail(data, job.data.from);
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
  public add = (data: any) => {
    const jobId = uuid();
    console.log(`Add mail job: ${jobId} ${data.email} ${data.subject}`);
    this.queue.add(data, { jobId });
  };
}

export const emailQueue = new EmailQueue();
