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
      number: Joi.any(),
    }),
  }) as any,
  documentations: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      documentations: Joi.array().items(Joi.any()),
      pagination: Joi.object({
        page: Joi.number(),
        page_size: Joi.number(),
        total: Joi.number(),
        page_count: Joi.number(),
      }),
    }),
  }) as any,
  howtos: Joi.object({
    statusCode: Joi.number(),
    data: Joi.any(),
  }) as any,
  allHowto: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      tisc: Joi.any(),
      brand: Joi.any(),
      design: Joi.any(),
    }),
  }) as any,
};
