import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  productDownload: Joi.object({
    data: Joi.object({
      id: Joi.string(),
      product_id: Joi.string(),
      file_name: Joi.string(),
      url: Joi.string(),
      created_at: Joi.string(),
    }),
    statusCode: Joi.number(),
  }) as any,
  productDownloads: Joi.object({
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        product_id: Joi.string(),
        file_name: Joi.string(),
        url: Joi.string(),
        created_at: Joi.string(),
      })
    ),
    statusCode: Joi.number(),
  }),
};
