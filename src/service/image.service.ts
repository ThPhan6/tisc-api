import {
  VALID_IMAGE_TYPES,
  DESIGN_STORE,
  MESSAGES,
  BrandStoragePath
} from "@/constants";
import {
  getFileTypeFromBase64,
  randomName,
  removeSpecialChars,
} from "@/helper/common.helper";
import { toWebp } from "@/helper/image.helper";
import { errorMessageResponse } from "@/helper/response.helper";
import { deleteFile, isExists, upload } from "@/service/aws.service";
import { ValidImage } from "@/types";
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

export const uploadImagesProduct = (
  images: string[],
  keywords: string[],
  brandName: string,
  brandId: string
) => {
  const formatedBrandName = removeSpecialChars(
    brandName.trim().toLowerCase().split(" ").join("-").replace(/ /g, "-")
  );
  const timestamps = moment();
  return Promise.all(
    images.map(async (image, index) => {
      const mediumBuffer = await toWebp(Buffer.from(image, "base64"));
      const cleanKeywords = keywords.length
        ? "-" +
          keywords
            .map((item) => {
              return item.trim().replace(/ /g, "-");
            })
            .join("-")
        : "";
      const fileName = `${formatedBrandName}${cleanKeywords}-${timestamps.unix()}${index}`;

      await upload(
        mediumBuffer,
        `product/${brandId}/${fileName}_medium.webp`,
        "image/webp"
      );
      return `/product/${brandId}/${fileName}_medium.webp`;
    })
  );
};

export const uploadImage = async (validImages: ValidImage[]) => {
  return Promise.all(
    validImages.map(async (item) => {
      return upload(
        item.buffer,
        item.path[0] === "/" ? item.path.slice(1) : item.path,
        item.mime_type
      );
    })
  );
};


export const uploadLogo = async (
  newPath: string, oldPath: string,
  base: string = DESIGN_STORE
) => {
  let logoPath;
  if ((await isExists(newPath.slice(1))) || oldPath === newPath) {
    logoPath = oldPath?.slice(1);
  } else {
    await deleteFile(oldPath.slice(1));

    //upload logo
    const fileType = await getFileTypeFromBase64(newPath);
    const fileName = randomName(8);

    if (
      !fileType ||
      !VALID_IMAGE_TYPES.find((validType) => validType === fileType.mime)
    ) {
      return errorMessageResponse(MESSAGES.IMAGE_INVALID);
    }
    logoPath = `${base}/${fileName}.${fileType.ext}`;

    await uploadImage([
      {
        buffer: Buffer.from(newPath, "base64"),
        path: logoPath,
        mime_type: fileType.mime,
      },
    ]);
  }
  return logoPath;
};
