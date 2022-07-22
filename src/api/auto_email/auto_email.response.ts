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
      topic: Joi.number(),
      targeted_for: Joi.number(),
      title: Joi.string(),
      message: Joi.string(),
      created_at: Joi.string(),
    }),
    statusCode: Joi.number(),
  }) as any,
  getList: Joi.object({
    data: Joi.object({
      auto_emails: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          topic: Joi.number(),
          targeted_for: Joi.number(),
          topic_key: Joi.string(),
          targeted_for_key: Joi.string(),
          title: Joi.string(),
          message: Joi.string(),
          created_at: Joi.string(),
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
  }),
};
