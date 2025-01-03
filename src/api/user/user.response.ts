import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);
const userData = Joi.object({
  id: Joi.string(),
  role_id: Joi.string(),
  firstname: Joi.any().allow(null),
  lastname: Joi.any().allow(null),
  fullname: Joi.any().allow(null),
  gender: Joi.boolean().allow(null),
  location_id: Joi.string().allow(null),
  department_id: Joi.string().allow(null),
  position: Joi.any().allow(null),
  email: Joi.any(),
  phone: Joi.any(),
  mobile: Joi.any(),
  avatar: Joi.any(),
  backup_email: Joi.any(),
  personal_mobile: Joi.any(),
  personal_phone_code: Joi.any(),
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
  interested: Joi.any(),
  retrieve_favourite: Joi.bool(),
  remark: Joi.any(),
});

export default {
  getOne: Joi.object({
    data: userData,
    statusCode: Joi.number(),
  }) as any,
  getList: Joi.object({
    data: Joi.object({
      users: Joi.array().items(userData),
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
  getInterestedOptions: Joi.array().items({
    key: Joi.string(),
    value: Joi.number(),
  }),

  getTeamGroupByCountry: Joi.object({
    data: Joi.array().items(
      Joi.object({
        country_name: Joi.string(),
        count: Joi.number(),
        users: Joi.array().items(
          Joi.object({
            id: Joi.string(),
            avatar: Joi.string().allow(null, ""),
            firstname: Joi.string(),
            lastname: Joi.string().allow(""),
            gender: Joi.boolean().allow(null),
            work_location: Joi.any(),
            department: Joi.any(),
            position: Joi.string().allow(""),
            email: Joi.string(),
            phone: Joi.string().allow(""),
            mobile: Joi.string().allow(""),
            access_level: Joi.string(),
            status: Joi.number(),
            phone_code: Joi.string().allow(""),
          })
        ),
      })
    ),
    statusCode: Joi.number(),
  }),

  getTiscTeamsProfile: {
    data: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        users: Joi.array().items(
          Joi.object({
            id: Joi.string(),
            role_id: Joi.string(),
            avatar: Joi.string().allow(null, ""),
            firstname: Joi.string(),
            lastname: Joi.string(),
            is_assigned: Joi.boolean(),
          })
        ),
      })
    ),
    statusCode: Joi.number(),
  },
};
