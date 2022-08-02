import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));
export default {
  getOne: Joi.object({
    statusCode: Joi.number(),
    data: Joi.any(),
  }) as any,
  getListRequirementType: Joi.object({
    data: Joi.array().items({
      id: Joi.string(),
      name: Joi.string(),
    }),
    statusCode: Joi.number(),
  }),
  getListInstructionType: Joi.object({
    data: Joi.array().items({
      id: Joi.string(),
      name: Joi.string(),
    }),
    statusCode: Joi.number(),
  }),
  getListUnitType: Joi.object({
    data: Joi.array().items({
      id: Joi.string(),
      name: Joi.string(),
      code: Joi.string(),
    }),
    statusCode: Joi.number(),
  }),
};
