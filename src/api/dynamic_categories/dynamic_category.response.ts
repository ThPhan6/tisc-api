import Joi from "joi";

export const DynamicCategoryResponse = Joi.any();

export default {
  getOne: Joi.object({
    statusCode: Joi.number(),
    data: DynamicCategoryResponse,
  }),
  getAll: Joi.object({
    statusCode: Joi.number(),
    data: DynamicCategoryResponse,
  }),
};
