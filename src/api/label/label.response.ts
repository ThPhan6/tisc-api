import HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export const labelResponse = Joi.any();

export default {
  getList: Joi.object({
    data: Joi.any(),
    statusCode: Joi.number(),
  }) as any,
  getOne: Joi.object({
    data: labelResponse,
    statusCode: Joi.number(),
  }) as any,
};
