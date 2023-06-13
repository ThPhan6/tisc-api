import { ENVIRONMENT } from "@/config";
import Bull from "bull";
import { BaseQueue } from "./base.queue";
import path from "path";

class ColorDetectionQueue extends BaseQueue {
  constructor() {
    super(
      new Bull(
        "Color_detection",
        `redis://${ENVIRONMENT.REDIS_HOST}:${ENVIRONMENT.REDIS_PORT}`
      )
    );
  }

  public process = () => {
    const rootPath = path.resolve(__dirname);
    const ext = path.extname(__filename);
    this.queue.process(
      this.concurrency,
      `${rootPath}/processes/color_detection.process${ext}`
    );
  };
  public add = (data: { product_id: string; images: string[] }) => {
    this.queue.add(data);
  };
}

export const colorDetectionQueue = new ColorDetectionQueue();
