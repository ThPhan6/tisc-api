import {
  VALID_IMAGE_TYPES,
  DESIGN_STORE,
  MESSAGES,
  ImageSize,
} from "@/constants";
import {
  getFileTypeFromBase64,
  randomName,
  simplizeString,
} from "@/helper/common.helper";
import { toWebp } from "@/helper/image.helper";
import { errorMessageResponse } from "@/helper/response.helper";
import { imageQueue } from "@/queues/image.queue";
import {
  deleteFile,
  getBufferFile,
  isExists,
  upload,
} from "@/service/aws.service";
import { ValidImage } from "@/types";
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
      imageQueue.add({
        file: image,
        file_name: `product/${brandId}/${fileName}.webp`,
        file_type: "image/webp",
        create_png: true,
      });
      return `/product/${brandId}/${fileName}.webp`;
    })
  );
};

export const uploadImages = (
  validImages: ValidImage[],
  size: number = ImageSize.small
) => {
  validImages.map((item) => {
    imageQueue.add({
      file: item.image,
      file_name: item.path[0] === "/" ? item.path.slice(1) : item.path,
      file_type: "image/webp",
      create_png: false,
      size,
    });
    return true;
  });
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
    const webp = await toWebp(Buffer.from(newPath, "base64"), size);
    await upload(webp, logoPath, "image/webp");
  }
  return logoPath;
};
