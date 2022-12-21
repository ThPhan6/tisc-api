import HapiJoi from "joi";
import { productResponse } from "@/api/product/product.response";

const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  favoriteProductSummary: Joi.object({
    data: Joi.object({
      categories: Joi.array().items(
        Joi.object({
          id: Joi.any(),
          name: Joi.any(),
        })
      ),
      brands: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
          logo: Joi.string().allow(null, ''),
          mission_n_vision: Joi.string().allow(null, ''),
          slogan: Joi.string().allow(null, ''),
          official_websites: Joi.array().items(
            Joi.object({
              url: Joi.string(),
              country_id: Joi.string(),
            })
          ),
        })
      ),
      category_count: Joi.number(),
      brand_count: Joi.number(),
      card_count: Joi.number(),
    }),
    statusCode: Joi.number(),
  }) as any,
  getProductList: Joi.object({
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        name: Joi.string(),
        count: Joi.number(),
        brand_logo: Joi.string().allow(null),
        products: Joi.array().items(productResponse),
      })
    ),

    statusCode: Joi.number(),
  }) as any,
};
