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
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        topic: Joi.number(),
        targeted_for: Joi.number(),
        title: Joi.string(),
        message: Joi.string(),
        created_at: Joi.string(),
      })
    ),
    statusCode: Joi.number(),
  }),
};
