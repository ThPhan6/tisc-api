import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  getOne: Joi.object({
    data: Joi.any(),
    statusCode: Joi.number(),
  }) as any,
  getList: Joi.object({
    data: Joi.object({
      quotations: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          author: Joi.string(),
          identity: Joi.string(),
          quotation: Joi.string(),
          created_at: Joi.string(),
        })
      ),
      pagination: Joi.object({
        page: Joi.number(),
        page_size: Joi.number(),
        total: Joi.number(),
        page_count: Joi.number(),
      }),
    }),
    statusCode: Joi.number(),
  }) as any,
  getlistType: Joi.object({
    statusCode: Joi.number(),
    data: Joi.array().items({
      id: Joi.string(),
      name: Joi.string(),
    }),
  }) as any,
  getMeasurementUnitOptions: Joi.array().items({
    key: Joi.string(),
    value: Joi.number(),
  }) as any,
};
