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
  brandName: string,
  brandId: string,
  collections?: any[],
  productName?: string
) => {
  const formatedBrandName = simplizeString(brandName);
  const formatedCollectionName = collections
    ?.map((collection) => {
      return simplizeString(collection.name || "");
    })
    .join("-");
  const formatedProductName = simplizeString(productName || "");
  return Promise.all(
    images.map(async (image) => {
      const fileType = await getFileTypeFromBase64(image);
      if (!fileType) {
        return image;
      }

      // const fileName = fileNameFromKeywords(keywords, formatedBrandName);
      const fileKeywords = [
        formatedBrandName,
        formatedCollectionName,
        formatedProductName,
        moment.now(),
      ];
      const newFileName = fileKeywords.join("-");
      const webpBuffer = await toWebp(
        Buffer.from(image, "base64"),
        ImageSize.large
      );
      const pngBuffer = await toPng(webpBuffer);
      await upload(
        webpBuffer,
        `product/${brandId}/${newFileName}.webp`,
        "image/webp"
      );
      await upload(
        pngBuffer,
        `product/${brandId}/${newFileName}.png`,
        "image/png"
      );
      return `/product/${brandId}/${newFileName}.webp`;
    })
  );
};
export const uploadImagesInventory = (
  images: string[],
  brandName: string,
  brandId: string,
  inventoryName?: string
) => {
  const formatedBrandName = simplizeString(brandName);

  const formatedInventoryName = simplizeString(inventoryName || "");
  return Promise.all(
    images.map(async (image) => {
      const fileType = await getFileTypeFromBase64(image);
      if (!fileType) {
        return image;
      }

      // const fileName = fileNameFromKeywords(keywords, formatedBrandName);
      const fileKeywords = [
        formatedBrandName,
        formatedInventoryName,
        moment.now(),
      ];
      const newFileName = fileKeywords.join("-");
      const webpBuffer = await toWebp(
        Buffer.from(image, "base64"),
        ImageSize.large
      );
      const pngBuffer = await toPng(webpBuffer);
      await upload(
        webpBuffer,
        `inventory/${brandId}/${newFileName}.webp`,
        "image/webp"
      );
      await upload(
        pngBuffer,
        `inventory/${brandId}/${newFileName}.png`,
        "image/png"
      );
      return `/inventory/${brandId}/${newFileName}.webp`;
    })
  );
};
export const uploadGalleryImages = (
  images: string[],
  collectionId: string,
  options?: {
    brandName: string;
    collectionName: string;
  }
) => {
  const brandName = simplizeString(options?.brandName || "");
  const collectionName = simplizeString(options?.collectionName || "");
  return Promise.all(
    images.map(async (image) => {
      const fileType = await getFileTypeFromBase64(image);
      if (!fileType) {
        return image;
      }
      const largeName = [brandName, collectionName, moment.now(), "l"].join(
        "-"
      );
      const smallName = [brandName, collectionName, moment.now(), "s"].join(
        "-"
      );
      const largeImage = await toWebp(
        Buffer.from(image, "base64"),
        ImageSize.large
      );
      await upload(
        largeImage,
        `collection/${collectionId}/${largeName}.webp`,
        "image/webp"
      );
      const smallImage = await toWebp(
        Buffer.from(image, "base64"),
        ImageSize.medium
      );
      await upload(
        smallImage,
        `collection/${collectionId}/${smallName}.webp`,
        "image/webp"
      );

      return `/collection/${collectionId}/${smallName}.webp`;
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
      let buffer: Buffer;
      if (!fileType) {
        buffer = await getBufferFile(image.slice(1));
      } else {
        const webpBuffer = await toWebp(
          Buffer.from(image, "base64"),
          ImageSize.large
        );
        buffer = await toPng(webpBuffer);
      }

      const fileName = moment.now();
      const filePath = `${path.resolve("")}/${folder}/${fileName}.png`;
      fs.writeFileSync(filePath, buffer);
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
