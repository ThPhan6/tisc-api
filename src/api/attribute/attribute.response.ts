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
          description: Joi.string(),
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
              description: Joi.string(),
              content_type: Joi.string().allow(""),
            })
          ),
          created_at: Joi.string(),
        })
      ),
      group_count: Joi.number(),
      attribute_count: Joi.number(),
    }),
    statusCode: Joi.number(),
  }) as any,
};
