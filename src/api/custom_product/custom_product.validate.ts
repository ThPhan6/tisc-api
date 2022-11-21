import Joi from "joi";
import {
  requireStringValidation,
  getOneValidation,
  errorMessage,
  requireEmailValidation,
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

export const customProductOptionValidate = Joi.object({
  id: Joi.string().allow(null),
  title: requireStringValidation("Option title"),
  use_image: Joi.boolean(),
  tag: requireStringValidation("Option tag"),
  items: Joi.array()
    .min(1)
    .error(errorMessage("Require at least 1 option choice"))
    .items(
      Joi.object({
        id: Joi.string().allow(null),
        image: Joi.when("use_image", {
          is: true,
          then: requireStringValidation(
            "Image is required in the Option with type image",
            "full"
          ),
          otherwise: Joi.string().allow(null),
        }),
        description: requireStringValidation("Option description"),
        product_id: requireStringValidation("Option product ID"),
      })
    ),
});

export const customProductValidate = Joi.object({
  name: requireStringValidation("Product name"),
  description: requireStringValidation("Product description"),
  images: Joi.array()
    .min(1)
    .error(errorMessage("Require at least 1 image"))
    .max(4)
    .error(errorMessage("Require at maximum 4 images"))
    .items(Joi.string().trim())
    .required()
    .error(errorMessage("Require at least 1 image")),
  attributes: Joi.array().items(basicAttributeValidate),
  specification: Joi.array().items(basicAttributeValidate),
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
