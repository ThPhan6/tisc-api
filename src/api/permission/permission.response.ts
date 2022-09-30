import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  getList: Joi.object({
    data: Joi.array().items({
      id: Joi.string(),
      parent_id: Joi.string().allow(null),
      logo: Joi.string().allow(null),
      name: Joi.string(),
      accessable: Joi.boolean().allow(null),
      items: Joi.array().items({
        id: Joi.string(),
        name: Joi.string(),
        accessable: Joi.boolean().allow(null),
      }),
      number: Joi.number(),
      parent_number: Joi.number().allow(null),
      subs: Joi.any(),
    }),
    statusCode: Joi.number(),
  }) as any,
  getOne: Joi.object({
    data: Joi.any(),
    statusCode: Joi.number(),
  }) as any,
};
