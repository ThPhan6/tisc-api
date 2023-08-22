import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));

export default {
  linkages: {
    data: Joi.array().items({
      from: Joi.string(),
      from_product_id: Joi.string(),
      to: Joi.string(),
      to_product_id: Joi.string(),
      is_pair: Joi.boolean(),
      created_at: Joi.any(),
      updated_at: Joi.any(),
      created_by: Joi.any(),
    }),
    statusCode: Joi.number(),
  } as any,
  linkage_rest_options: Joi.any() as any,
};
