import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));
export default {
  getOne: Joi.object({
    statusCode: Joi.number(),
    data: Joi.any(),
  }) as any,
  getList: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      data: Joi.any(),
      summary: Joi.array().items({
        name: Joi.string(),
        value: Joi.number(),
      }),
    }),
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
    }),
    statusCode: Joi.number(),
  }),
};
