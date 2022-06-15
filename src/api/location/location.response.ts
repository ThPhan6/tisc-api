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
  getOne: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      id: Joi.string(),
      business_name: Joi.string(),
      business_number: Joi.string(),
      functional_types: Joi.array().items({
        id: Joi.string(),
        name: Joi.string(),
      }),
      country: Joi.object({
        id: Joi.string(),
        name: Joi.string(),
      }),
      state: Joi.object({
        id: Joi.string(),
        name: Joi.string(),
      }),
      city: Joi.object({
        id: Joi.string(),
        name: Joi.string(),
      }),
      address: Joi.string(),
      postal_code: Joi.string(),
      general_phone: Joi.string(),
      general_email: Joi.string(),
      created_at: Joi.string(),
      phone_code: Joi.string(),
    }),
  }) as any,
};
