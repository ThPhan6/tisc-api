import { toWebp } from "@/helper/image.helper";
import { upload } from "@/service/aws.service";
import { removeSpecialChars, getFileTypeFromBase64 } from "@/helper/common.helper";
import { VALID_IMAGE_TYPES } from "@/constant/common.constant";
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
}

export const uploadImagesProduct = (
  images: string[],
  keywords: string[],
  brandName: string,
  brandId: string,
) => {
  const formatedBrandName = removeSpecialChars(
    brandName.trim().toLowerCase().split(" ").join("-").replace(/ /g, "-")
  );
  const timestamps = moment();
  return Promise.all(images.map(async (image, index) => {
    const mediumBuffer = await toWebp(Buffer.from(image, "base64"), "medium");
    const cleanKeywords = keywords.map((item) => {
      return item.trim().replace(/ /g, "-");
    });
    let fileName = `${formatedBrandName}-${cleanKeywords.join(
      "-"
    )}-${timestamps.unix()}${index}`;
    await upload(
      mediumBuffer,
      `product/${brandId}/${fileName}_medium.webp`,
      "image/webp"
    );
    return `/product/${brandId}/${fileName}_medium.webp`;
  }));
};
