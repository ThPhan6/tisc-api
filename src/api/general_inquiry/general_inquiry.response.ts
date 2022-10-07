import HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));

export default {
  getOne: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      product_id: Joi.string(),
      title: Joi.string(),
      message: Joi.string(),
      inquiry_for_ids: Joi.array().items(Joi.string().allow(null)),
      status: Joi.number(),
      read: Joi.array().items(Joi.string()),
      created_at: Joi.string(),
      created_by: Joi.string(),
      id: Joi.string(),
      updated_at: Joi.string().allow(null),
    }),
  }) as any,
};
