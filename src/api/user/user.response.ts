import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  getOne: Joi.object({
    data: Joi.object({
      id: Joi.string(),
      role_id: Joi.string(),
      firstname: Joi.string(),
      lastname: Joi.string(),
      fullname: Joi.string(),
      gender: Joi.any(),
      location_id: Joi.string().allow(null),
      department_id: Joi.string().allow(null),
      position: Joi.string().allow(null),
      email: Joi.string(),
      phone: Joi.any(),
      mobile: Joi.any(),
      avatar: Joi.any(),
      backup_email: Joi.any(),
      personal_mobile: Joi.any(),
      linkedin: Joi.any(),
      created_at: Joi.any(),
      phone_code: Joi.string().allow(""),
      work_location: Joi.any(),
      access_level: Joi.any(),
      status: Joi.number(),
      type: Joi.number(),
      relation_id: Joi.any(),
      permissions: Joi.any(),
      brand: Joi.any(),
      design: Joi.any(),
    }),
    statusCode: Joi.number(),
  }) as any,
  getList: Joi.object({
    data: Joi.object({
      users: Joi.array().items({
        id: Joi.string(),
        firstname: Joi.string(),
        lastname: Joi.string(),
        fullname: Joi.string(),
        work_location: Joi.any(),
        position: Joi.any(),
        email: Joi.string(),
        phone: Joi.any(),
        avatar: Joi.any(),
        access_level: Joi.any(),
        created_at: Joi.any(),
        status: Joi.any(),
        phone_code: Joi.string().allow(""),
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
