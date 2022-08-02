import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));
export default {
  getList: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      summary: Joi.array().items({
        name: Joi.string(),
        value: Joi.number(),
      }),
      considered_products: Joi.array().items(Joi.any()),
    }),
  }) as any,
  getListStatus: Joi.array().items({
    key: Joi.string(),
    value: Joi.number(),
  }),
};
