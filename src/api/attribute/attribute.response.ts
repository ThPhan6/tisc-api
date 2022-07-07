import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  getOne: Joi.object({
    data: Joi.object({
      id: Joi.string(),
      name: Joi.string(),
      count: Joi.number(),
      subs: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
          basis_id: Joi.string(),
          description: Joi.any(),
          description_1: Joi.any(),
          description_2: Joi.any(),
          content_type: Joi.string().allow(""),
        })
      ),
      created_at: Joi.string(),
    }),
    statusCode: Joi.number(),
  }) as any,
  getList: Joi.object({
    data: Joi.object({
      attributes: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
          count: Joi.number(),
          subs: Joi.array().items(
            Joi.object({
              id: Joi.string(),
              name: Joi.string(),
              basis_id: Joi.string(),
              description: Joi.any(),
              description_1: Joi.any(),
              description_2: Joi.any(),
              content_type: Joi.string().allow(""),
            })
          ),
          created_at: Joi.string(),
        })
      ),
      summary: Joi.array().items(
        Joi.object({
          name: Joi.string(),
          value: Joi.number(),
        })
      ),
      pagination: Joi.object({
        page: Joi.number(),
        page_size: Joi.number(),
        total: Joi.number(),
        page_count: Joi.number(),
      }),
    }),
    statusCode: Joi.number(),
  }) as any,
  getListContentType: Joi.object({
    data: Joi.object({
      texts: Joi.any(),
      conversions: Joi.any(),
      presets: Joi.any(),
      options: Joi.any(),
    }),
    statusCode: Joi.number(),
  }) as any,
  getListAttributeProduct: Joi.object({
    data: Joi.object({
      generals: Joi.any(),
      features: Joi.any(),
      specifications: Joi.any(),
    }),
    statusCode: Joi.number(),
  }) as any,
};
