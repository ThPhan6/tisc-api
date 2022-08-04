import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));
export default {
  get: Joi.object({
    statusCode: Joi.number(),
    data: Joi.any(),
  }) as any,
  getMaterialCodeGroup: {
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        name: Joi.string(),
        count: Joi.number(),
        subs: Joi.array().items(
          Joi.object({
            id: Joi.string(),
            name: Joi.string(),
            count: Joi.number(),
            codes: Joi.array().items(
              Joi.object({
                id: Joi.string(),
                code: Joi.string(),
                description: Joi.string(),
              })
            ),
          })
        ),
      })
    ),
    statusCode: Joi.number(),
  },
};
