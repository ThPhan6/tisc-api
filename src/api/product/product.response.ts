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
    data: Joi.any(),
    statusCode: Joi.number(),
  }) as any,
  getListProductLeftInCollection: Joi.object({
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
