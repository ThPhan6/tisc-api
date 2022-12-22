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
