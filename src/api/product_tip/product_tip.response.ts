import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  one: Joi.object({
    data: Joi.object({
      id: Joi.string(),
      product_id: Joi.string(),
      contents: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          title: Joi.string(),
          content: Joi.string(),
        })
      ),
      created_at: Joi.string(),
    }),
    statusCode: Joi.number(),
  }) as any,
  many: Joi.object({
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        product_id: Joi.string(),
        contents: Joi.array().items(
          Joi.object({
            id: Joi.string(),
            title: Joi.string(),
            content: Joi.string(),
          })
        ),
        created_at: Joi.string(),
      })
    ),
    statusCode: Joi.number(),
  }),
};
