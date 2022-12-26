import { ENVIROMENT } from "@/config";
import Bull from "bull";
import { mailService } from "@/service/mail.service";
import { TransactionEmailPayload } from "@/types";
import { logRepository } from "@/repositories/log.repository";

class EmailQueue {
  private queue: Bull.Queue<any>;
  constructor() {
    this.queue = new Bull(
      "Email queue",
      `redis://${ENVIROMENT.REDIS_HOST}:${ENVIROMENT.REDIS_PORT}`
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
        logRepository.create({
          extra: {
            title: job.data.subject,
            to: job.data.to,
            from: job.data.from,
          },
          message: error.toString(),
        });
      }
    });
  };
  public add = (data: any) => {
    this.queue.add(data);
  };
}

export const emailQueue = new EmailQueue();
