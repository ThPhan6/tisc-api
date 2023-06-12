import { ENVIRONMENT } from "@/config";
import Bull from "bull";
import { BaseQueue } from "./base.queue";
import _ from "lodash";
import { colorService } from "@/api/color/color.service";
import productRepository from "@/repositories/product.repository";
import moment from "moment";
import path from "path";
import fs from "fs";
import { cpFileBucketToLocal } from "@/services/image.service";

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
    this.queue.process(async (job, done) => {
      const folder = `public/temp/${moment.now().toString()}`;
      const dir = `${path.resolve("")}/${folder}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const uploadedToLocal: any = (
        await cpFileBucketToLocal(job.data.images, folder)
      ).filter((item) => item !== undefined);
      const result = await colorService.extractColors(uploadedToLocal);
      if (fs.existsSync(dir)) {
        fs.rmdirSync(dir, { recursive: true });
      }
      await productRepository.update(job.data.product_id, {
        colors: result,
      });
      done();
    });
  };
  public add = (data: { product_id: string; images: string[] }) => {
    this.queue.add(data);
  };
}

export const colorDetectionQueue = new ColorDetectionQueue();
