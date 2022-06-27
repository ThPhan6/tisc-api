import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  getList: Joi.object({
    data: Joi.object({
      products: Joi.array().items(Joi.any()),
      pagination: Joi.object({
        page: Joi.number(),
        page_size: Joi.number(),
        total: Joi.number(),
        page_count: Joi.number(),
      }),
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
      images: Joi.any(),
      created_at: Joi.string(),
      created_by: Joi.any(),
    }),
    statusCode: Joi.number(),
  }) as any,
};
