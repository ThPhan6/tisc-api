import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));

export const contactResponseValidate = {
  id: Joi.string(),
  name: Joi.string(),
  email: Joi.string(),
  inquiry: Joi.string().allow(null),
  created_at: Joi.string(),
  updated_at: Joi.string().allow(null),
};
export default {
  contact: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object(contactResponseValidate),
  }) as any,
  contacts: Joi.object({
    statusCode: Joi.number(),
    data: Joi.array().items(Joi.object(contactResponseValidate)),
  }) as any,
};
