import Bull from "bull";
import { slackService } from "@/service/slack.service";
import { logRepository } from "@/repositories/log.repository";

export class BaseQueue {
  protected queue: Bull.Queue<any>;
  constructor(queue: Bull.Queue<any>) {
    this.queue = queue
    this.clearQueue();
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
  public log(error: any, type?: "slack" | "log_collections") {
    if (!type || type === "slack") {
      slackService.errorHook("", "", error.stack);
    }
    if(type === 'log_collections') {
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
