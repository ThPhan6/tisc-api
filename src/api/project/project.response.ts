import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  getOne: Joi.object({
    data: Joi.any(),
    statusCode: Joi.number(),
  }) as any,
  getList: Joi.object({
    data: Joi.any(),
    statusCode: Joi.number(),
  }) as any,
  getlistType: Joi.object({
    statusCode: Joi.number(),
    data: Joi.array().items({
      id: Joi.string(),
      name: Joi.string(),
    }),
  }) as any,
  getMeasurementUnitOptions: Joi.array().items({
    key: Joi.string(),
    value: Joi.number(),
  }) as any,
};
