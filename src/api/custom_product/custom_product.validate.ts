import Joi from "joi";
import {
  requireStringValidation,
  getOneValidation,
  requireEmailValidation,
  stringValidation,
} from "@/validate/common.validate";
import {
  dimensionAndWeightValidate,
  validateShareProduct,
} from "@/api/product/product.validate";

export const basicAttributeValidate = Joi.object({
  name: Joi.string().trim(),
  content: Joi.string().trim(),
});

export const customProductContactValidate = Joi.array().items(
  Joi.object({
    first_name: Joi.string().trim(),
    last_name: Joi.string().trim(),
    position: Joi.string().trim(),
    work_email: requireEmailValidation("Work email"),
    work_phone: Joi.string().trim(),
    work_mobile: Joi.string().trim(),
  })
);

const optionItemValidate = {
  id: Joi.string().allow(null, ""),
  description: requireStringValidation("Option description"),
  product_id: stringValidation(),
};

export const customProductOptionValidate = Joi.object({
  id: stringValidation(),
  title: requireStringValidation("Option title"),
  use_image: Joi.boolean(),
  tag: stringValidation(),
  items: Joi.when("use_image", {
    is: true,
    then: Joi.array().items(
      Joi.object({
        ...optionItemValidate,
        image: requireStringValidation(
          "Image",
          "Image is required in the Option with type image"
        ),
      })
    ),
    otherwise: Joi.array().items(
      Joi.object({
        ...optionItemValidate,
        image: stringValidation(),
      })
    ),
  }),
});

export const customProductValidate = Joi.object({
  name: requireStringValidation("Product name"),
  description: requireStringValidation("Product description"),
  images: Joi.array()
    .min(1)
    .max(4)
    .items(Joi.string().trim())
    .required()
    .label("Image")
    .messages({
      "any.required": "Required at least one image",
      "array.min": "Required at least one image",
      "array.max": "Maximum 4 images are allowed",
    }),
  attributes: Joi.array().items(basicAttributeValidate),
  specifications: Joi.array().items(basicAttributeValidate),
  options: Joi.array().items(customProductOptionValidate),
  collection_id: requireStringValidation("Collection"),
  company_id: requireStringValidation("Brand company"),
  dimension_and_weight: dimensionAndWeightValidate,
});

export default {
  createProduct: {
    payload: customProductValidate,
  },
  updateProduct: {
    ...getOneValidation,
    payload: customProductValidate,
  },
  getListProduct: {
    query: {
      company_id: Joi.string().trim().allow(""),
      collection_id: Joi.string().trim().allow(""),
    },
  },
  shareByEmail: validateShareProduct,
};
