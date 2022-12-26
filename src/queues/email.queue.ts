import { ENVIROMENT } from "@/config";
import Bull from "bull";
import { mailService } from "@/service/mail.service";
import { emailLogRepository } from "@/repositories/email_log.repository";

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
      let data: any = {};
      data = {
        to: [{ email: "" }],
        subject: job.data.subject,
        htmlContent: job.data.html,
      };
      if (job.data.attachment) {
        data = {
          ...data,
          attachment: {
            content: job.data.attachment_content,
            name: job.data.attachment_name,
          },
        };
      }
      const response = await mailService.sendTransactionEmail(data);
      if (!response) {
        await emailLogRepository.create({
          type: job.data.type,
          email: job.data.email,
          message: "Fail",
        });
      }
      done();
    });
  };
  public add = (data: any) => {
    this.queue.add(data);
  };
}

export const emailQueue = new EmailQueue();
