import { RouteOptionsPayload } from "@hapi/hapi";


export const VALID_IMAGE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
];

export const DefaultLogo = "/logo/default-logo.png";
export const DefaultProductImage = "/product/default-product-image.png";

export const imageOptionPayload: RouteOptionsPayload = {
  maxBytes: 1024 * 1024 * 5,
  multipart: {
    output: "stream",
  },
  parse: true,
  failAction: (_request, _h, err: any) => {
    if (err.output) {
      if (err.output.statusCode === 413) {
        err.output.payload.message = `Can not upload file size greater than 5MB`;
      }
    }
    throw err;
  },
};

export enum ImageSize {
  large = 900,
  medium = 300,
  small = 100,
  thumbnail = 50
}

export enum ImageDPI {
  high = 300,
  medium = 150,
  low = 72
}

export enum ImageQuality {
  high = 100,
  medium = 80,
  low = 50
}

/* https://sharp.pixelplumbing.com/api-resize */
export enum ImageFit {
  cover = 'cover',
  contain = 'contain',
  fill = 'fill',
  inside = 'inside',
  outside = 'outside'
}
