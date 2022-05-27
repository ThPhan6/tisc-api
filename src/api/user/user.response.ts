import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  getUser: Joi.object({
    data: Joi.object({
      firstname: Joi.string(),
      lastname: Joi.string(),
      gender: Joi.any(),
      location: Joi.string(),
      position: Joi.string(),
      email: Joi.string(),
      phone: Joi.any(),
      mobile: Joi.any(),
      avatar: Joi.any(),
      backup_email: Joi.any(),
      personal_mobile: Joi.any(),
      linkedin: Joi.any(),
    }),
    statusCode: Joi.number(),
  }) as any,
};
