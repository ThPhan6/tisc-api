import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));

export default {
  getOne: Joi.object({
    statusCode: Joi.number(),
    data: Joi.any(),
  }) as any,
};
