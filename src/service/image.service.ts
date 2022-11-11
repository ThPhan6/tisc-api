import { VALID_IMAGE_TYPES, DESIGN_STORE, MESSAGES } from "@/constants";
import {
  getFileTypeFromBase64,
  randomName,
  removeSpecialChars,
} from "@/helper/common.helper";
import { toWebp } from "@/helper/image.helper";
import { errorMessageResponse } from "@/helper/response.helper";
import { brandRepository } from "@/repositories/brand.repository";
import { deleteFile, isExists, upload } from "@/service/aws.service";
import { BrandAttributes, ValidImage } from "@/types";
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
      const mediumBuffer = await toWebp(Buffer.from(image, "base64"), "medium");
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
      await upload(item.buffer, item.path, item.mime_type);
      return true;
    })
  );
};

export const uploadLogoBrand = async (logo: any, brand: BrandAttributes) => {
  if (
    !VALID_IMAGE_TYPES.find(
      (item) => item === logo.hapi.headers["content-type"]
    )
  ) {
    return errorMessageResponse(MESSAGES.LOGO_NOT_VALID);
  }

  const fileNameParts = logo.hapi.filename.split(".");

  const fileName = fileNameParts[0] + "_" + moment();

  const newFileName = fileName + "." + fileNameParts[1];

  if (brand.logo) {
    const urlParts = brand.logo.split("/");
    const oldNameParts = urlParts[2].split(".");

    await deleteFile(brand.logo.slice(1));
    await deleteFile("brand-logo/" + oldNameParts[0] + "_large.webp");
    await deleteFile("brand-logo/" + oldNameParts[0] + "_medium.webp");
    await deleteFile("brand-logo/" + oldNameParts[0] + "_small.webp");
    await deleteFile("brand-logo/" + oldNameParts[0] + "_thumbnail.webp");
  }

  const uploadedData = await upload(
    Buffer.from(logo._data),
    "brand-logo/" + newFileName,
    logo.hapi.headers["content-type"]
  );

  //upload 4 size webp
  const largeBuffer = await toWebp(Buffer.from(logo._data), "large");

  await upload(
    largeBuffer,
    "brand-logo/" + fileName + "_large.webp",
    "image/webp"
  );

  const mediumBuffer = await toWebp(Buffer.from(logo._data), "medium");

  await upload(
    mediumBuffer,
    "brand-logo/" + fileName + "_medium.webp",
    "image/webp"
  );

  const smallBuffer = await toWebp(Buffer.from(logo._data), "small");

  await upload(
    smallBuffer,
    "brand-logo/" + fileName + "_small.webp",
    "image/webp"
  );

  const thumbnailBuffer = await toWebp(Buffer.from(logo._data), "thumbnail");

  await upload(
    thumbnailBuffer,
    "brand-logo/" + fileName + "_thumbnail.webp",
    "image/webp"
  );

  if (!uploadedData) {
    return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG);
  }

  await brandRepository.update(brand.id, {
    logo: "/brand-logo/" + newFileName,
  });

  return "/brand-logo/" + newFileName;
};

export const uploadLogoOfficeProfile = async (
  newLogo: string,
  oldLogo: string
) => {
  let logoPath;

  if ((await isExists(newLogo.slice(1))) || oldLogo === newLogo) {
    logoPath = oldLogo?.slice(1);
  } else {
    await deleteFile(oldLogo.slice(1));

    //upload logo
    const fileType = await getFileTypeFromBase64(newLogo);
    const fileName = randomName(8);

    if (
      !fileType ||
      !VALID_IMAGE_TYPES.find((validType) => validType === fileType.mime)
    ) {
      return errorMessageResponse(MESSAGES.IMAGE_INVALID);
    }
    logoPath = `${DESIGN_STORE}/${fileName}.${fileType.ext}`;

    await uploadImage([
      {
        buffer: Buffer.from(newLogo, "base64"),
        path: logoPath,
        mime_type: fileType.mime,
      },
    ]);
  }
  return logoPath;
};
