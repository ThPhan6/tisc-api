import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export const subsAttribute = {
  id: Joi.string(),
  name: Joi.string(),
  basis_id: Joi.string(),
  description: Joi.any(),
  description_1: Joi.any(),
  description_2: Joi.any(),
  content_type: Joi.string().allow(""),
  basis: Joi.any(),
};

export default {
  getOne: Joi.object({
    data: Joi.object({
      id: Joi.string(),
      name: Joi.string(),
      count: Joi.number(),
      subs: Joi.array().items(Joi.object(subsAttribute)),
      created_at: Joi.string(),
      updated_at: Joi.string().allow(null),
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
          subs: Joi.array().items(Joi.object(subsAttribute)),
          created_at: Joi.string(),
          updated_at: Joi.string().allow(null),
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
  getAllAttribute: Joi.object({
    data: Joi.object({
      general: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
          type: Joi.number(),
          subs: Joi.array().items(Joi.object(subsAttribute)),
          created_at: Joi.string(),
          updated_at: Joi.string().allow(null),
        })
      ),
      feature: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
          type: Joi.number(),
          subs: Joi.array().items(Joi.object(subsAttribute)),
          created_at: Joi.string(),
          updated_at: Joi.string().allow(null),
        })
      ),
      specification: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
          type: Joi.number(),
          subs: Joi.array().items(Joi.object(subsAttribute)),
          created_at: Joi.string(),
          updated_at: Joi.string().allow(null),
        })
      ),
    }),
    statusCode: Joi.number(),
  }) as any,
};
