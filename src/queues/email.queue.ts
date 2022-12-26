import { ENVIROMENT } from "@/config";
import Bull from "bull";
import { mailService } from "@/service/mail.service";

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
        to: [{ email: job.data.email }],
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
      await mailService.sendTransactionEmail(data, job.data.from);
      done();
    });
  };
  public add = (data: any) => {
    this.queue.add(data);
  };
}

export const emailQueue = new EmailQueue();
