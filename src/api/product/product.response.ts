import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  getList: Joi.object({
    data: Joi.array().items(Joi.any()),
    statusCode: Joi.number(),
  }) as any,
  getOne: Joi.object({
    data: Joi.any(),
    statusCode: Joi.number(),
  }) as any,
};
