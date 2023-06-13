import fs from "fs";
import path from "path";
import moment from "moment";
import { uploadImagesToLocal } from "@/services/image.service";
import { extractTopColor } from "@/modules/colourDetection";
import { successResponse } from "@/helpers/response.helper";
import { COLOR_COLLECTIONS } from "@/constants/collection.constant";
import { sortObjectArray } from "@/helpers/common.helper";
class ColorService {
  private extractColor = (imagePath: string) => {
    return new Promise((resolve) => {
      extractTopColor(imagePath).then((result) => {
        resolve(result);
      });
    });
  };
  public extractColors = (images: { name: string; file: string }[]) => {
    return Promise.all(
      images.map(async (image) => {
        const extracted = await this.extractColor(image.file);
        return {
          name: image.name,
          color_specification: extracted,
        };
      })
    );
  };
  private imagesToColors = (images: any[]) => {
    return images.reduce((pre, cur) => {
      const colors = cur.color_specification;
      colors.forEach((color: any) => {
        pre = {
          ...pre,
          [color.conversion.hex]: {
            ...pre[color.conversion.hex],
            colors_fetched_counts:
              pre[color.conversion.hex]?.colors_fetched_counts ||
              0 + color.colors_fetched_counts,
            color,
          },
        };
      });
      return pre;
    }, {});
  };
  private getTheMostColor = (images: any[]) => {
    const colors = Object.values(this.imagesToColors(images));
    return sortObjectArray(colors, "colors_fetched_counts", "DESC")[0]
      ?.color as any;
  };
  public detectColor = async (images: string[]) => {
    const folder = `public/temp/${moment.now().toString()}`;
    const dir = `${path.resolve("")}/${folder}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const uploadedToLocal: any = (
      await uploadImagesToLocal(images, folder)
    ).filter((item) => item !== undefined);
    const result = await this.extractColors(uploadedToLocal);
    const mostColor = this.getTheMostColor(result);
    const recommendationCollection = this.recommendCollectionName({
      saturation: mostColor.conversion.origin.sat,
      lightness: mostColor.conversion.origin.lightness,
      hue: mostColor.conversion.origin.hue,
    });
    if (fs.existsSync(dir)) {
      fs.rmdirSync(dir, { recursive: true });
    }
    return successResponse({
      recommendation_collection: recommendationCollection,
      data: result,
    });
  };
  private recommendCollectionName = (params: {
    saturation: number;
    lightness: number;
    hue: number;
  }) => {
    if (params.saturation >= 15 && params.saturation <= 100) {
      //step 2
      if (params.lightness >= 0 && params.lightness <= 14)
        return "Black/almost-black collection";

      if (params.lightness >= 86 && params.lightness <= 100)
        return "White/off-white Collection";

      if (params.lightness >= 15 && params.lightness <= 85) {
        //step 3
        const found = COLOR_COLLECTIONS.find(
          (item) => params.hue >= item.hue.from && params.hue <= item.hue.to
        );
        return found?.name || "N/A";
      }
    } else if (params.saturation >= 0 && params.saturation <= 14) {
      //step 1
      const found = COLOR_COLLECTIONS.find(
        (item) =>
          params.lightness >= item.lightness.from &&
          params.lightness <= item.lightness.to
      );
      return found?.name || "N/A";
    }
    return "N/A";
  };
  public getColorCollection = async (
    saturation: number,
    lightness: number,
    hue: number
  ) => {
    return successResponse({
      recommendation_collection: this.recommendCollectionName({
        saturation,
        lightness,
        hue,
      }),
    });
  };
}

export const colorService = new ColorService();

export default ColorService;
