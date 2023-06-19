import { errorMessage } from "@/validates/common.validate";
import Joi from "joi";

export default {
  detectColor: {
    payload: {
      // images: Joi.array().items(Joi.string()),
      category_ids: Joi.array()
        .items(Joi.string())
        .required()
        .error(errorMessage("Category is required")),
      images: Joi.array()
        .items(Joi.string())
        .required()
        .error(errorMessage("Images is required")),
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
