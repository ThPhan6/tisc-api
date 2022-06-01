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
      is_deleted: Joi.boolean(),
      author: Joi.string().allow(null),
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
        is_deleted: Joi.boolean(),
        author: Joi.object({
          id: Joi.string(),
          firstname: Joi.string(),
          lastname: Joi.string(),
          gender: Joi.string().allow(null),
          department: Joi.string().allow(null),
          position: Joi.string().allow(null),
          created_at: Joi.string().allow(null),
        }),
      })
    ),
  }) as any,
};
