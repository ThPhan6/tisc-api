import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  getList: Joi.object({
    data: Joi.object({
      collections: Joi.array().items({
        id: Joi.string(),
        brand_id: Joi.any(),
        name: Joi.string(),
        created_at: Joi.string(),
      }),
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
      brand_id: Joi.string(),
      name: Joi.string(),
      created_at: Joi.string(),
      updated_at: Joi.string().allow(null),
      delete_at: Joi.string().allow(null),
    }),
    statusCode: Joi.number(),
  }) as any,
};
