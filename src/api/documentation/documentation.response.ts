import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  documentation: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      id: Joi.string(),
      logo: Joi.string().allow(null),
      type: Joi.number().allow(null),
      title: Joi.string(),
      document: Joi.object(),
      created_at: Joi.any(),
      created_by: Joi.any(),
      updated_at: Joi.any(),
    }),
  }) as any,
  documentations: Joi.object({
    statusCode: Joi.number(),
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        logo: Joi.string().allow(null),
        type: Joi.number().allow(null),
        title: Joi.string(),
        document: Joi.object(),
        created_at: Joi.any(),
        created_by: Joi.any(),
        updated_at: Joi.any(),
      })
    ),
  }) as any,
};
