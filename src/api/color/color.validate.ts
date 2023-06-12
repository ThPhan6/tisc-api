import { errorMessage } from "@/validates/common.validate";
import Joi from "joi";

export default {
  detectColor: {
    payload: {
      // images: Joi.array().items(Joi.string()),
      images: Joi.array()
        .min(3)
        .max(9)
        .items(Joi.string())
        .required()
        .error(errorMessage("Images is required at least 3 valid data")),
    },
  },
  getColorCollection: {
    query: {
      saturation: Joi.number().min(0).max(100),
      lightness: Joi.number().min(0).max(100),
      hue: Joi.number().min(0).max(359),
    },
  },
};
