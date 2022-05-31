import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));
export default {
  contact: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      id: Joi.string(),
      name: Joi.string(),
      email: Joi.string(),
      inquiry: Joi.string().allow(null),
      created_at: Joi.any(),
    }),
  }) as any,
  // contacts: Joi.object({
  //   statusCode: Joi.number(),
  //   data: Joi.array().items(
  //     Joi.object({
  //       id: Joi.string(),
  //       name: Joi.string(),
  //       email: Joi.string(),
  //       inquiry: Joi.string().allow(null),
  //       created_at: Joi.any(),
  //     })
  //   ),
  // }) as any,
};
