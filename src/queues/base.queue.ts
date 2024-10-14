import Bull from "bull";
import { slackService } from "@/services/slack.service";
import { logRepository } from "@/repositories/log.repository";

export class BaseQueue {
  protected queue: Bull.Queue<any>;
  protected concurrency: number;
  constructor(queue: Bull.Queue<any>) {
    this.queue = queue;
    this.concurrency = 10;

    this.clearQueue();

    this.setupQueueListeners();
  }
  private clearQueue() {
    this.queue.clean(0, "delayed");
    this.queue.clean(0, "wait");
    this.queue.clean(0, "active");
    this.queue.clean(0, "completed");
    this.queue.clean(0, "failed");

    let multi = this.queue.multi();
    multi.del(this.queue.toKey("repeat"));
    multi.exec();
  }
  private setupQueueListeners() {
    this.queue.on("failed", (job, err) => {
      console.error(`Job ${job.id} failed:`, err);
      this.log(err, "log_collections"); // Log the error to your log repository
    });

    this.queue.on("stalled", (job) => {
      console.warn(`Job ${job.id} stalled`);
      this.log(new Error(`Job ${job.id} stalled`), "log_collections");
    });

    this.queue.on("completed", (job, result) => {
      console.log(`Job ${job.id} completed successfully`);
    });

    this.queue.on("error", (error) => {
      console.error("Queue encountered an error:", error);
      this.log(error, "slack"); // Send error notifications to Slack
    });
  }
  public log(error: any, type?: "slack" | "log_collections") {
    if (!type || type === "slack") {
      slackService.errorHook("", "", error.stack);
    }
    if (type === "log_collections") {
      logRepository.create({
        extra: {
          title: error.subject,
          to: error.to,
          from: error.from,
        },
        message: error.message,
      });
    }
  }
}
