import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));
export default {
  countries: Joi.object({
    statusCode: Joi.number(),
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        name: Joi.string(),
        phone_code: Joi.string(),
      })
    ),
  }) as any,
  states: Joi.object({
    statusCode: Joi.number(),
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        name: Joi.string(),
      })
    ),
  }) as any,
};
