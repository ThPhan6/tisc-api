import fs from "fs";
import path from "path";
import moment from "moment";
import { uploadImagesToLocal } from "@/services/image.service";
import { extractTopColor } from "@/modules/colourDetection";
import {
  errorMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { COLOR_COLLECTIONS } from "@/constants/collection.constant";
import { sortObjectArray } from "@/helpers/common.helper";
import { DetectedColor, ColorSpecification, DetectedImage } from "./color.type";
import { productService } from "../product/product.service";
class ColorService {
  private extractColor = (imagePath: string): Promise<ColorSpecification> => {
    return new Promise((resolve) => {
      extractTopColor(imagePath).then((result: any) => {
        resolve(result);
      });
    });
  };

  private imagesToColors = (images: DetectedImage[]) => {
    return images.reduce((pre, cur) => {
      const colors = cur.color_specification;
      colors.forEach((color: DetectedColor) => {
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
    }, {} as any);
  };
  private getTheMostColor = (images: DetectedImage[]) => {
    const colors: any = Object.values(this.imagesToColors(images));
    return sortObjectArray(colors, "colors_fetched_counts", "DESC")[0]
      ?.color as DetectedColor;
  };

  private recommendCollection = (params: {
    saturation: number;
    lightness: number;
    hue: number;
    unit: "percent" | "number";
  }) => {
    let saturation = params.saturation;
    let lightness = params.lightness;
    let hue = params.hue;
    if (params.unit === "number") {
      saturation = params.saturation * 100;
      lightness = params.lightness * 100;
    }
    if (saturation >= 15 && saturation <= 100) {
      //step 2
      if (lightness >= 0 && lightness <= 14)
        return COLOR_COLLECTIONS.find(
          (item) => item.id === "4d9971c3-0c56-453a-9714-84f6c279dc4d"
        );

      if (lightness >= 86 && lightness <= 100)
        return COLOR_COLLECTIONS.find(
          (item) => item.id === "ca5a1f78-718c-494f-adff-d67c316e4db4"
        );

      if (lightness >= 15 && lightness <= 85) {
        //step 3
        const found = COLOR_COLLECTIONS.find(
          (item) => hue >= item.hue.from && hue <= item.hue.to
        );
        return found;
      }
    } else if (saturation >= 0 && saturation <= 14) {
      //step 1
      const found = COLOR_COLLECTIONS.find(
        (item) =>
          lightness >= item.lightness.from && lightness <= item.lightness.to
      );
      return found;
    }
    return undefined;
  };
  public getColorCollection = async (
    saturation: number,
    lightness: number,
    hue: number
  ) => {
    const collection = this.recommendCollection({
      saturation,
      lightness,
      hue,
      unit: "percent",
    });
    return successResponse({
      recommendation_collection: {
        id: collection?.id,
        name: collection?.name,
      },
    });
  };
  public detectColor = async (images: string[], categoryIds: string[]) => {
    const isSupported = await productService.checkSupportedColorDetection(
      categoryIds
    );
    if (!isSupported)
      return errorMessageResponse("Not supported for these categories");
    const folder = `public/temp/${moment.now().toString()}`;
    const dir = `${path.resolve("")}/${folder}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const uploadedToLocal: any = (
      await uploadImagesToLocal(images, folder)
    ).filter((item) => item !== undefined);
    const result = await this.extractColors(uploadedToLocal);
    const mostColor = this.getTheMostColor([result[0]]);
    const recommendationCollection = this.recommendCollection({
      saturation: mostColor.conversion.origin.sat,
      lightness: mostColor.conversion.origin.lightness,
      hue: mostColor.conversion.origin.hue,
      unit: "number",
    });
    if (fs.existsSync(dir)) {
      fs.rmdirSync(dir, { recursive: true });
    }
    return successResponse({
      data: {
        recommendation_collection: {
          id: recommendationCollection?.id,
          name: recommendationCollection?.name,
        },
        images: this.mappingTemperature(result),
      },
    });
  };
  public extractColors = (
    images: { name: string; file: string }[]
  ): Promise<DetectedImage[]> => {
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
  public mappingTemperature = (
    detectedImages: DetectedImage[]
  ): DetectedImage[] => {
    return detectedImages.map((detectedImage) => {
      return {
        ...detectedImage,
        color_specification: detectedImage.color_specification.map((color) => {
          const recommendationCollection = this.recommendCollection({
            saturation: color.conversion.origin.sat,
            lightness: color.conversion.origin.lightness,
            hue: color.conversion.origin.hue,
            unit: "number",
          });
          return {
            ...color,
            conversion: {
              ...color.conversion,
              origin: {
                ...color.conversion.origin,
                temperature: recommendationCollection?.temperature,
              },
            },
          };
        }),
      };
    }) as any;
  };
}

export const colorService = new ColorService();

export default ColorService;
