import Joi from "joi";
import { customProductValidate } from "./custom_product.validate";

export default {
  getProductList: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      products: Joi.array().items({
        id: Joi.string(),
        name: Joi.string(),
        description: Joi.string(),
        company_id: Joi.string(),
        collection_id: Joi.string(),
        location: Joi.string(),
        image: Joi.string(),
        company_name: Joi.string(),
        collection_name: Joi.string(),
      }),
    }),
  }),
  getOneProduct: Joi.object({
    data: customProductValidate.keys({
      id: Joi.string(),
      collection_name: Joi.string(),
      company_name: Joi.string(),
      created_at: Joi.string(),
      updated_at: Joi.string(),
      design_id: Joi.string(),
    }),
    statusCode: Joi.number(),
  }),
};
