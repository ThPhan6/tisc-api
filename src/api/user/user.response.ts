import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  getOne: Joi.object({
    data: Joi.object({
      firstname: Joi.string(),
      lastname: Joi.string(),
      gender: Joi.any(),
      location_id: Joi.string().allow(null),
      position: Joi.string().allow(null),
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
  getList: Joi.object({
    data: Joi.object({
      users: Joi.array().items({
        firstname: Joi.string(),
        lastname: Joi.string(),
        gender: Joi.any(),
        location: Joi.string().allow(null),
        position: Joi.string().allow(null),
        email: Joi.string(),
        phone: Joi.any(),
        mobile: Joi.any(),
        avatar: Joi.any(),
        backup_email: Joi.any(),
        personal_mobile: Joi.any(),
        linkedin: Joi.any(),
      }),
      pagination: Joi.object({
        page: Joi.number(),
        page_size: Joi.number(),
        total: Joi.number(),
        page_count: Joi.number(),
      }),
    }),
    statusCode: Joi.number(),
  }) as any,
  avatar: Joi.object({
    data: Joi.object({
      url: Joi.string(),
    }),
    statusCode: Joi.number(),
  }) as any,
  getListDepartment: Joi.object({
    statusCode: Joi.number(),
    data: Joi.array().items({
      id: Joi.string(),
      name: Joi.string(),
    }),
  }) as any,
};
