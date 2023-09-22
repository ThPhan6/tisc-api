import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));

export default {
  linkages: {
    data: Joi.array().items({
      from: Joi.string(),
      from_product_id: Joi.string(),
      to: Joi.string(),
      to_product_id: Joi.string(),
      is_pair: Joi.boolean(),
      created_at: Joi.any(),
      updated_at: Joi.any(),
      created_by: Joi.any(),
    }),
    statusCode: Joi.number(),
  } as any,
  steps: {
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        specification_id: Joi.string(),
        product_id: Joi.string(),
        name: Joi.string(),
        order: Joi.number(),
        options: Joi.array().items({
          id: Joi.string(),
          replicate: Joi.number(),
          pre_option: Joi.any(),
          pre_option_name: Joi.any(),
          picked: Joi.any(),
          value_1: Joi.any(),
          value_2: Joi.any(),
          unit_1: Joi.any(),
          unit_2: Joi.any(),
          image: Joi.any(),
          product_id: Joi.any(),
          sub_id: Joi.any(),
          sub_name: Joi.any(),
        }),
        created_by: Joi.any(),
        created_at: Joi.any(),
        updated_at: Joi.any(),
      })
    ),
    statusCode: Joi.number(),
  } as any,
  configurationSteps: {
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        step_id: Joi.string(),
        options: Joi.array().items({
          id: Joi.string(),
          quantity: Joi.number(),
        }),
        created_by: Joi.any(),
        created_at: Joi.any(),
        updated_at: Joi.any(),
      })
    ),
    statusCode: Joi.number(),
  } as any,
  linkage_rest_options: {
    data: Joi.array().items({
      id: Joi.string(),
      name: Joi.string(),
      subs: Joi.array().items({
        id: Joi.string(),
        name: Joi.string(),
        subs: Joi.array().items({
          id: Joi.string(),
          product_id: Joi.string(),
          image: Joi.any(),
          value_1: Joi.any(),
          value_2: Joi.any(),
          unit_1: Joi.any(),
          unit_2: Joi.any(),
        }),
      }),
    }),
    statusCode: Joi.number(),
  } as any,
};
