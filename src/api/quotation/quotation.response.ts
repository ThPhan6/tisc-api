import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  getOne: Joi.object({
    data: Joi.object({
      id: Joi.string(),
      author: Joi.string(),
      identity: Joi.string(),
      quotation: Joi.string(),
      created_at: Joi.string(),
    }),
    statusCode: Joi.number(),
  }) as any,
  getList: Joi.object({
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        author: Joi.string(),
        identity: Joi.string(),
        quotation: Joi.string(),
        created_at: Joi.string(),
      })
    ),
    statusCode: Joi.number(),
  }) as any,
};
