import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  productTip: Joi.object({
    data: Joi.object({
      id: Joi.string(),
      product_id: Joi.string(),
      title: Joi.string(),
      content: Joi.string(),
      created_at: Joi.string(),
    }),
  }),
};
