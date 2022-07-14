import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  getList: Joi.object({
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        name: Joi.string(),
        count: Joi.number(),
        products: Joi.array().items(
          Joi.object({
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
            keywords: Joi.array().items(Joi.string()),
            created_at: Joi.any(),
            created_by: Joi.any(),
            keywords: Joi.array().items(Joi.string()),
          })
        ),
      })
    ),
    statusCode: Joi.number(),
  }) as any,
  brandProductSummary: Joi.object({
    data: Joi.object({
      categories: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
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
    data: Joi.object({
      id: Joi.string(),
      brand: {
        id: Joi.string(),
        name: Joi.string(),
      },
      collection: {
        id: Joi.string(),
        name: Joi.string(),
      },
      categories: Joi.array().items({
        id: Joi.string(),
        name: Joi.string(),
      }),
      name: Joi.string(),
      code: Joi.string(),
      description: Joi.any(),
      general_attribute_groups: Joi.any(),
      feature_attribute_groups: Joi.any(),
      specification_attribute_groups: Joi.any(),
      favorites: Joi.number(),
      images: Joi.array().items(Joi.string()),
      keywords: Joi.array().items(Joi.string()),
      created_at: Joi.string(),
      created_by: Joi.any(),
    }),
    statusCode: Joi.number(),
  }) as any,
  getListRestCollectionProduct: Joi.object({
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        collection_id: Joi.string(),
        name: Joi.string(),
        images: Joi.array().items(Joi.string()).allow(null),
        created_at: Joi.string(),
      })
    ),
    statusCode: Joi.number(),
  }) as any,
};
