import sharp from "sharp";
import * as dotenv from "dotenv";
dotenv.config();

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
  return `${process.env.SPACES_ENDPOINT}/${process.env.SPACES_BUCKET}${filename}`;
}
