import {
  VALID_IMAGE_TYPES,
  DESIGN_STORE,
  MESSAGES,
  ImageSize,
  ImageQuality,
} from "@/constants";
import {
  getFileTypeFromBase64,
  randomName,
  simplizeString,
} from "@/helpers/common.helper";
import { toPng, toWebp } from "@/helpers/image.helper";
import { errorMessageResponse } from "@/helpers/response.helper";
import {
  deleteFile,
  getBufferFile,
  isExists,
  upload,
} from "@/services/aws.service";
import { ValidImage } from "@/types";
import fs from "fs";
import path from "path";
import moment from "moment";

export const validateImageType = async (images: string[]) => {
  let isValidImage = true;
  for (const image of images) {
    const fileType = await getFileTypeFromBase64(image);
    if (
      !fileType ||
      !VALID_IMAGE_TYPES.find((validType) => validType === fileType.mime)
    ) {
      isValidImage = false;
    }
  }
  return isValidImage;
};

export const splitImageByType = async (images: string[]) => {
  const imagePath: string[] = [];
  const imageBase64: string[] = [];
  for (const image of images) {
    const fileType = await getFileTypeFromBase64(image);
    if (
      !fileType ||
      !VALID_IMAGE_TYPES.find((validType) => validType === fileType.mime)
    ) {
      imagePath.push(image);
    } else {
      imageBase64.push(image);
    }
  }
  return { imagePath, imageBase64 };
};
const fileNameFromKeywords = (
  keywords: string[],
  formatedBrandName: string
) => {
  const cleanKeywords = keywords.length
    ? "-" +
      keywords
        .map((item) => {
          return item.trim().replace(/ /g, "-");
        })
        .join("-")
    : "";
  return `${formatedBrandName}${cleanKeywords}-l-${randomName(8)}`;
};
export const updateProductImageNames = (
  images: string[],
  keywords: string[],
  brandName: string,
  brandId: string
) => {
  return Promise.all(
    images.map(async (image) => {
      const bufferFromStorage = await getBufferFile(image.slice(1));
      const formatedBrandName = simplizeString(brandName);
      const fileName = fileNameFromKeywords(keywords, formatedBrandName);
      await upload(
        bufferFromStorage,
        `product/${brandId}/${fileName}.webp`,
        "image/webp"
      );
      return `/product/${brandId}/${fileName}.webp`;
    })
  );
};
export const uploadImagesProduct = (
  images: string[],
  keywords: string[],
  brandName: string,
  brandId: string
) => {
  const formatedBrandName = simplizeString(brandName);
  return Promise.all(
    images.map(async (image) => {
      const fileType = await getFileTypeFromBase64(image);
      if (!fileType) {
        return image;
      }

      const fileName = fileNameFromKeywords(keywords, formatedBrandName);
      const webpBuffer = await toWebp(
        Buffer.from(image, "base64"),
        ImageSize.large
      );
      const pngBuffer = await toPng(webpBuffer);
      await upload(
        webpBuffer,
        `product/${brandId}/${fileName}.webp`,
        "image/webp"
      );
      await upload(
        pngBuffer,
        `product/${brandId}/${fileName}.png`,
        "image/png"
      );
      return `/product/${brandId}/${fileName}.webp`;
    })
  );
};
export const getFileNameInPath = (path?: string): string => {
  if (!path || path === "") return "";
  const parts = path.split("/");
  return parts[parts.length - 1];
};
export const cpFileBucketToLocal = (imagePaths: string[], folder: string) => {
  const dir = `${path.resolve("")}/${folder}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return Promise.all(
    imagePaths.map(async (imagePath) => {
      const buffer = await getBufferFile(imagePath.slice(1));
      const localPath = `${path.resolve("")}/${folder}/${getFileNameInPath(
        imagePath
      )}`;
      fs.writeFileSync(localPath, buffer);
      return {
        name: getFileNameInPath(imagePath),
        file: localPath,
      };
    })
  );
};
export const uploadImagesToLocal = (images: string[], folder: string) => {
  return Promise.all(
    images.map(async (image) => {
      const fileType = await getFileTypeFromBase64(image);
      if (!fileType) {
        return undefined;
      }

      const fileName = moment.now();
      const webpBuffer = await toWebp(
        Buffer.from(image, "base64"),
        ImageSize.large
      );
      const pngBuffer = await toPng(webpBuffer);
      const filePath = `${path.resolve("")}/${folder}/${fileName}.png`;
      fs.writeFileSync(filePath, pngBuffer);
      return {
        file: filePath,
        name: fileName,
      };
    })
  );
};

export const uploadImages = (
  validImages: ValidImage[],
  size: number = ImageSize.small
) => {
  return Promise.all(
    validImages.map(async (item) => {
      const webpBuffer = await toWebp(Buffer.from(item.image, "base64"), size);
      return upload(
        webpBuffer,
        item.path[0] === "/" ? item.path.slice(1) : item.path,
        "image/webp"
      );
    })
  );
};

export const uploadLogo = async (
  newPath: string,
  oldPath: string,
  base: string = DESIGN_STORE,
  size: number = ImageSize.small,
  file_name?: string
) => {
  let logoPath;
  if ((await isExists(newPath.slice(1))) || oldPath === newPath) {
    logoPath = oldPath?.slice(1);
  } else {
    if (oldPath && oldPath !== "") {
      await deleteFile(oldPath.slice(1));
    }

    //upload logo
    const fileType = await getFileTypeFromBase64(newPath);
    const fileName = file_name || randomName(8);

    if (
      !fileType ||
      !VALID_IMAGE_TYPES.find((validType) => validType === fileType.mime)
    ) {
      return errorMessageResponse(MESSAGES.IMAGE_INVALID);
    }
    logoPath = `${base}/${fileName}.webp`;

    const webp = await toWebp(
      Buffer.from(newPath, "base64"),
      size,
      ImageQuality.high,
      true
    );
    await upload(webp, logoPath, "image/webp");
  }
  return logoPath;
};
