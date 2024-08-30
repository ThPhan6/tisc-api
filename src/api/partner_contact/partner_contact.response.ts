import Joi from "joi";

export default {
  getList: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      pagination: Joi.any(),
      partner_contacts: Joi.any(),
    }),
  }),
  getOne: Joi.object({
    statusCode: Joi.number(),
    data: Joi.any(),
  }),
};
