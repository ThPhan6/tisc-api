import fs from "fs";
import path from "path";
import moment from "moment";
import { uploadImagesToLocal } from "@/services/image.service";
import { extractTopColor } from "@/modules/colourDetection";
import {
  errorMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import {
  COLOR_COLLECTIONS,
  COLOR_COLLECTION_IDS,
} from "@/constants/collection.constant";
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
      saturation = Math.round(saturation * 100);
      lightness = Math.round(lightness * 100);
    }
    if (saturation >= 11 && saturation <= 100) {
      //step 2
      let group = 1;

      switch (saturation) {
        case 11:
        case 12:
        case 13:
          if (0 <= lightness && lightness <= 17) group = 1;
          if (18 <= lightness && lightness <= 93) group = 2;
          if (94 <= lightness && lightness <= 100) group = 3;
          break;
        case 14:
        case 15:
          if (0 <= lightness && lightness <= 17) group = 1;
          if (18 <= lightness && lightness <= 92) group = 2;
          if (93 <= lightness && lightness <= 100) group = 3;
          break;
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 21:
          if (0 <= lightness && lightness <= 16) group = 1;
          if (17 <= lightness && lightness <= 92) group = 2;
          if (93 <= lightness && lightness <= 100) group = 3;
          break;
        case 22:
        case 23:
          if (0 <= lightness && lightness <= 16) group = 1;
          if (17 <= lightness && lightness <= 92) group = 2;
          if (93 <= lightness && lightness <= 100) group = 3;
          break;
        case 24:
        case 25:
        case 26:
        case 27:
        case 28:
        case 29:
        case 30:
        case 31:
        case 32:
          if (0 <= lightness && lightness <= 15) group = 1;
          if (16 <= lightness && lightness <= 92) group = 2;
          if (93 <= lightness && lightness <= 100) group = 3;
          break;
        case 33:
        case 34:
        case 35:
        case 36:
        case 37:
        case 38:
        case 39:
        case 40:
        case 41:
          if (0 <= lightness && lightness <= 15) group = 1;
          if (16 <= lightness && lightness <= 92) group = 2;
          if (93 <= lightness && lightness <= 100) group = 3;
          break;
        case 42:
        case 43:
        case 44:
        case 45:
        case 46:
        case 47:
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
          if (0 <= lightness && lightness <= 13) group = 1;
          if (14 <= lightness && lightness <= 92) group = 2;
          if (93 <= lightness && lightness <= 100) group = 3;
          break;
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
        case 58:
        case 59:
        case 60:
        case 61:
          if (0 <= lightness && lightness <= 12) group = 1;
          if (13 <= lightness && lightness <= 92) group = 2;
          if (93 <= lightness && lightness <= 100) group = 3;
          break;
        case 62:
        case 63:
        case 64:
        case 65:
          if (0 <= lightness && lightness <= 12) group = 1;
          if (13 <= lightness && lightness <= 94) group = 2;
          if (95 <= lightness && lightness <= 100) group = 3;
          break;
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
          if (0 <= lightness && lightness <= 11) group = 1;
          if (12 <= lightness && lightness <= 94) group = 2;
          if (95 <= lightness && lightness <= 100) group = 3;
          break;
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 91:
        case 92:
        case 93:
        case 94:
        case 95:
        case 96:
        case 97:
        case 98:
          if (0 <= lightness && lightness <= 10) group = 1;
          if (11 <= lightness && lightness <= 94) group = 2;
          if (95 <= lightness && lightness <= 100) group = 3;
          break;
        case 99:
        case 100:
          if (0 <= lightness && lightness <= 9) group = 1;
          if (10 <= lightness && lightness <= 94) group = 2;
          if (95 <= lightness && lightness <= 100) group = 3;
          break;

        default:
          break;
      }
      if (group === 1)
        return COLOR_COLLECTIONS.find(
          (item) => item.id === COLOR_COLLECTION_IDS.BLACK_ALMOST_BLACK
        );

      if (group === 3)
        return COLOR_COLLECTIONS.find(
          (item) => item.id === COLOR_COLLECTION_IDS.WHITE_OFFWHITE
        );

      if (group === 2) {
        //step 3
        const found = COLOR_COLLECTIONS.find(
          (item) => hue >= item.hue.from && hue <= item.hue.to
        );
        return found;
      }
    } else if (saturation >= 0 && saturation <= 10) {
      //step 1
      //1: black, 2: dark grey, 3: medium grey, 4: light grey, 5: white/off-white
      let group = 1;
      switch (saturation) {
        case 0:
          if (0 <= lightness && lightness <= 19) group = 1;
          if (20 <= lightness && lightness <= 64) group = 2;
          if (65 <= lightness && lightness <= 75) group = 3;
          if (76 <= lightness && lightness <= 93) group = 4;
          if (94 <= lightness && lightness <= 100) group = 5;
          break;
        case 1:
          if (0 <= lightness && lightness <= 19) group = 1;
          if (20 <= lightness && lightness <= 69) group = 2;
          if (70 <= lightness && lightness <= 84) group = 3;
          if (85 <= lightness && lightness <= 93) group = 4;
          if (94 <= lightness && lightness <= 100) group = 5;
          break;
        case 2:
          if (0 <= lightness && lightness <= 19) group = 1;
          if (20 <= lightness && lightness <= 68) group = 2;
          if (69 <= lightness && lightness <= 84) group = 3;
          if (85 <= lightness && lightness <= 93) group = 4;
          if (94 <= lightness && lightness <= 100) group = 5;
          break;
        case 3:
          if (0 <= lightness && lightness <= 19) group = 1;
          if (20 <= lightness && lightness <= 69) group = 2;
          if (70 <= lightness && lightness <= 84) group = 3;
          if (85 <= lightness && lightness <= 93) group = 4;
          if (94 <= lightness && lightness <= 100) group = 5;
          break;
        case 4:
          if (0 <= lightness && lightness <= 19) group = 1;
          if (20 <= lightness && lightness <= 68) group = 2;
          if (69 <= lightness && lightness <= 83) group = 3;
          if (84 <= lightness && lightness <= 93) group = 4;
          if (94 <= lightness && lightness <= 100) group = 5;
          break;
        case 5:
          if (0 <= lightness && lightness <= 18) group = 1;
          if (19 <= lightness && lightness <= 68) group = 2;
          if (69 <= lightness && lightness <= 84) group = 3;
          if (85 <= lightness && lightness <= 93) group = 4;
          if (94 <= lightness && lightness <= 100) group = 5;
          break;
        case 6:
          if (0 <= lightness && lightness <= 18) group = 1;
          if (19 <= lightness && lightness <= 69) group = 2;
          if (70 <= lightness && lightness <= 83) group = 3;
          if (84 <= lightness && lightness <= 93) group = 4;
          if (94 <= lightness && lightness <= 100) group = 5;
          break;
        case 7:
          if (0 <= lightness && lightness <= 18) group = 1;
          if (19 <= lightness && lightness <= 68) group = 2;
          if (69 <= lightness && lightness <= 84) group = 3;
          if (85 <= lightness && lightness <= 93) group = 4;
          if (94 <= lightness && lightness <= 100) group = 5;
          break;
        case 8:
        case 9:
          if (0 <= lightness && lightness <= 18) group = 1;
          if (19 <= lightness && lightness <= 67) group = 2;
          if (68 <= lightness && lightness <= 83) group = 3;
          if (84 <= lightness && lightness <= 93) group = 4;
          if (94 <= lightness && lightness <= 100) group = 5;
          break;
        case 10:
          if (0 <= lightness && lightness <= 18) group = 1;
          if (19 <= lightness && lightness <= 66) group = 2;
          if (67 <= lightness && lightness <= 83) group = 3;
          if (84 <= lightness && lightness <= 93) group = 4;
          if (94 <= lightness && lightness <= 100) group = 5;
          break;

        default:
          break;
      }
      let groupId = "";
      switch (group) {
        case 1:
          groupId = COLOR_COLLECTION_IDS.BLACK_ALMOST_BLACK;
          break;
        case 2:
          groupId = COLOR_COLLECTION_IDS.DARK_GREY;
          break;
        case 3:
          groupId = COLOR_COLLECTION_IDS.MID_GREY;
          break;
        case 4:
          groupId = COLOR_COLLECTION_IDS.LIGHT_GREY;
          break;
        case 5:
          groupId = COLOR_COLLECTION_IDS.WHITE_OFFWHITE;
          break;

        default:
          break;
      }
      const found = COLOR_COLLECTIONS.find((item) => item.id === groupId);
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
