import { ENVIRONMENT } from "@/config";
import { ImageSize } from "@/constants";
import { toPng, toWebp } from "@/helper/image.helper";
import { upload } from "@/service/aws.service";
import Bull from "bull";
import { BaseQueue } from "./base.queue";
export interface ImagePayload {
  file: string;
  file_name: string;
  file_type: string;
  create_png?: boolean;
  size?: number
}
class ImageQueue extends BaseQueue {
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
        const buffer = await toWebp(
          Buffer.from(job.data.file, "base64"),
          job.data.size || ImageSize.large
        );
        await upload(buffer, job.data.file_name, job.data.file_type);
        if (job.data.create_png) {
          const pngBuffer = await toPng(Buffer.from(job.data.file, "base64"));
          await upload(
            pngBuffer,
            job.data.file_name.replace(".webp", "png"),
            "image/png"
          );
        }
        done();
      } catch (error: any) {
        this.log(error);
      }
    });
  };
  public add = (data: ImagePayload) => {
    this.queue.add(data);
  };
}

export const imageQueue = new ImageQueue();
