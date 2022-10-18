import sharp from "sharp";
import {ENVIROMENT} from '@/config';

export const toWebp = async (
  image: any,
  type: "large" | "medium" | "small" | "thumbnail"
) => {
  let width = 0;
  let height = 0;
  switch (type) {
    case "large":
      width = 500;
      height = 500;
      break;
    case "medium":
      width = 300;
      height = 300;
      break;
    case "small":
      width = 200;
      height = 200;
      break;

    default:
      width = 150;
      height = 150;
      break;
  }
  return await sharp(image).resize(width, height).toBuffer();
};

export const getFileURI = (filename?: string | null) => {
  if (!filename) {
    return filename;
  }
  return `${ENVIROMENT.SPACES_ENDPOINT}/${ENVIROMENT.SPACES_BUCKET}${filename}`;
}
