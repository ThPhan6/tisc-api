import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));
export default {
  get: Joi.object({
    statusCode: Joi.number(),
    data: Joi.any(),
  }) as any,
};
