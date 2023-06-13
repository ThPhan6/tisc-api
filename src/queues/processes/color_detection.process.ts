import { colorService } from "@/api/color/color.service";
import productRepository from "@/repositories/product.repository";
import moment from "moment";
import path from "path";
import fs from "fs";
import { cpFileBucketToLocal } from "@/services/image.service";

export default async function (job: any) {
  try {
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
      colors: colorService.mappingTemperature(result),
    });

    return Promise.resolve(true);
  } catch (error) {
    return Promise.resolve(error);
  }
}
