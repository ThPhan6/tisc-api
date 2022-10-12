import Joi from "joi";

export default {
  getOne: Joi.object({
    data: Joi.any(),
    statusCode: Joi.number(),
  }) as any,
};
