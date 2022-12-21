import HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export const collectionResponse = Joi.object({
  id: Joi.string(),
  relation_id: Joi.string(),
  relation_type: Joi.number(),
  name: Joi.string(),
  created_at: Joi.string(),
  updated_at: Joi.string().allow(null),
});

export default {
  getList: Joi.object({
    data: Joi.object({
      collections: Joi.array().items(collectionResponse),
      pagination: Joi.object({
        page: Joi.number(),
        page_size: Joi.number(),
        total: Joi.number(),
        page_count: Joi.number(),
      }),
    }),
    statusCode: Joi.number(),
  }) as any,
  getOne: Joi.object({
    data: collectionResponse,
    statusCode: Joi.number(),
  }) as any,
};
