import HapiJoi from "joi";
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
          logo: Joi.string().allow(null),
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
        products: Joi.array().items(
          Joi.object({
            id: Joi.string(),
            brand: Joi.object({
              id: Joi.string(),
              name: Joi.string(),
              logo: Joi.string().allow(null),
            }),
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
            images: Joi.any(),
            keywords: Joi.array().items(Joi.string().allow("")),
            brand_location_id: Joi.any(),
            distributor_location_id: Joi.any(),
            created_by: Joi.any(),
            created_at: Joi.string(),
            is_liked: Joi.boolean(),
          })
        ),
      })
    ),

    statusCode: Joi.number(),
  }) as any,
};
