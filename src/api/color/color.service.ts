import fs from "fs";
import path from "path";
import moment from "moment";
import { uploadImagesToLocal } from "@/services/image.service";
import { extractTopColor } from "@/modules/colourDetection";
import {
  errorMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { sortObjectArray } from "@/helpers/common.helper";
import { DetectedColor, ColorSpecification, DetectedImage } from "./color.type";
import { productService } from "../product/product.service";
import { recommendStone, recommendWood } from "@/helpers/color.helper";
import { toRecommendCollections } from "./color.mapping";
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
    colorGroup?: "stone" | "wood";
  }) => {
    let saturation = params.saturation;
    let lightness = params.lightness;
    let hue = params.hue;
    if (params.unit === "number") {
      saturation = Math.round(saturation * 100);
      lightness = Math.round(lightness * 100);
    }
    if (params.colorGroup === "wood")
      return recommendWood(saturation, lightness, hue);
    return recommendStone(saturation, lightness, hue);
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
      recommendation_collection: toRecommendCollections(collection),
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
      colorGroup: isSupported,
    });
    if (fs.existsSync(dir)) {
      fs.rmdirSync(dir, { recursive: true });
    }
    return successResponse({
      data: {
        recommendation_collection: toRecommendCollections(
          recommendationCollection
        ),
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
                temperature: recommendationCollection[0]?.temperature || "N/A",
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
