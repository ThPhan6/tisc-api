import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export const productResponse = {
  id: Joi.string(),
  brand_id: Joi.string(),
  collection_id: Joi.any(),
  category_ids: Joi.array().items(Joi.any()),
  name: Joi.string(),
  code: Joi.any(),
  description: Joi.any(),
  general_attribute_groups: Joi.array().items(Joi.any()),
  feature_attribute_groups: Joi.array().items(Joi.any()),
  specification_attribute_groups: Joi.array().items(Joi.any()),
  favorites: Joi.number(),
  images: Joi.any(),
  keywords: Joi.array().items(Joi.string().allow("")),
  brand_location_id: Joi.any(),
  distributor_location_id: Joi.any(),
  created_at: Joi.any(),
  created_by: Joi.any(),
  is_liked: Joi.boolean(),
  brand: Joi.any(),
  collection: Joi.object({
    id: Joi.string(),
    name: Joi.string(),
  }),
  categories: Joi.array().items(
    Joi.object({
      id: Joi.any(),
      name: Joi.any(),
    })
  ),
  updated_at: Joi.string().allow(null),
};

export default {
  getList: Joi.object({
    data: Joi.object({
      data: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
          count: Joi.number(),
          products: Joi.array().items(Joi.object(productResponse)),
        })
      ),
      brand: Joi.any(),
    }),
    statusCode: Joi.number(),
  }) as any,
  getListDesignerProducts: Joi.object({
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        name: Joi.string(),
        count: Joi.number(),
        brand_logo: Joi.string().allow(null),
        products: Joi.array().items(Joi.object(productResponse)),
      })
    ),
    brand_summary: Joi.any(),
    statusCode: Joi.number(),
  }) as any,
  brandProductSummary: Joi.object({
    data: Joi.object({
      categories: Joi.array().items(
        Joi.object({
          id: Joi.any(),
          name: Joi.any(),
        })
      ),
      collections: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
        })
      ),
      category_count: Joi.number(),
      collection_count: Joi.number(),
      card_count: Joi.number(),
      product_count: Joi.number(),
    }),
    statusCode: Joi.number(),
  }) as any,
  getOne: Joi.object({
    data: Joi.object(productResponse),
    statusCode: Joi.number(),
  }) as any,
  getListRestCollectionProduct: Joi.object({
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        collection_id: Joi.string(),
        name: Joi.string(),
        images: Joi.any(),
        created_at: Joi.string(),
      })
    ),
    statusCode: Joi.number(),
  }) as any,
  getProductOptions: Joi.object({
    data: Joi.array().items({
      id: Joi.string(),
      name: Joi.any(),
      value_1: Joi.any(),
      value_2: Joi.any(),
      option_code: Joi.any(),
      image: Joi.any(),
    }),
    statusCode: Joi.number(),
  }) as any,
  commonTypes: Joi.object({
    data: Joi.array().items({
      id: Joi.string(),
      name: Joi.string(),
    }),
    statusCode: Joi.number(),
  }),
};
