import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));

export default {
  linkages: {
    data: Joi.array().items({
      from: Joi.string(),
      to: Joi.string(),
      is_pair: Joi.boolean(),
      created_at: Joi.any(),
      updated_at: Joi.any(),
      created_by: Joi.any(),
    }),
    statusCode: Joi.number(),
  } as any,
};
