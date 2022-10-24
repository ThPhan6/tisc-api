import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export const quotationResponseValidate = {
  id: Joi.string(),
  author: Joi.string(),
  identity: Joi.string(),
  quotation: Joi.string(),
  created_at: Joi.string(),
  updated_at: Joi.string().allow(null),
};

export default {
  getOne: Joi.object({
    data: Joi.object(quotationResponseValidate),
    statusCode: Joi.number(),
  }) as any,
  getList: Joi.object({
    data: Joi.object({
      quotations: Joi.array().items(Joi.object(quotationResponseValidate)),
      pagination: Joi.object({
        page: Joi.number(),
        page_size: Joi.number(),
        total: Joi.number(),
        page_count: Joi.number(),
      }),
    }),
    statusCode: Joi.number(),
  }) as any,
};
