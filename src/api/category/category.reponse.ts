import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  category: Joi.object({
    data: Joi.object({
      id: Joi.string(),
      name: Joi.string(),
      subs: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
          subs: Joi.array().items(
            Joi.object({
              id: Joi.string(),
              name: Joi.string(),
            })
          ),
        })
      ),
      created_at: Joi.string(),
      updated_at: Joi.string().allow(null),
    }),
    statusCode: Joi.number(),
  }) as any,
  categories: Joi.object({
    data: Joi.object({
      categories: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
          count: Joi.number(),
          subs: Joi.array().items(
            Joi.object({
              id: Joi.string(),
              name: Joi.string(),
              count: Joi.number(),
              subs: Joi.array().items(
                Joi.object({
                  id: Joi.string(),
                  name: Joi.string(),
                })
              ),
            })
          ),
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
};
