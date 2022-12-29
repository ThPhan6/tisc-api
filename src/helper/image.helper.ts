import sharp from "sharp";
import { ENVIROMENT } from "@/config";
import {ImageSize, ImageQuality, ImageFit} from '@/constants';

export const toWebp = async (
  image: Buffer,
  size: ImageSize = ImageSize.medium,
  quality: ImageQuality = ImageQuality.high,
  isSquare: Boolean = false,
  fit: ImageFit = ImageFit.cover
) => {
  let output = sharp(image).webp({ lossless: true, quality });
  if (isSquare) {
    output = output.resize(size, size, { fit });
  } else {
    output = output.resize(size);
  }
  return output.toBuffer();
}

export const getFileURI = (filename: string) => {
  if (!filename) {
    return filename;
  }
  return `${ENVIROMENT.SPACES_ENDPOINT}/${ENVIROMENT.SPACES_BUCKET}${filename}`;
};
