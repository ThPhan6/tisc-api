import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));
export default {
  countries: Joi.object({
    statusCode: Joi.number(),
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        name: Joi.string(),
        phone_code: Joi.string(),
      })
    ),
  }) as any,
  states: Joi.object({
    statusCode: Joi.number(),
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        name: Joi.string(),
      })
    ),
  }) as any,
  getOne: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      id: Joi.string(),
      business_name: Joi.string(),
      business_number: Joi.string(),
      functional_types: Joi.array().items({
        id: Joi.string(),
        name: Joi.string(),
      }),
      country_id: Joi.string(),
      state_id: Joi.string(),
      city_id: Joi.string(),
      country_name: Joi.string(),
      state_name: Joi.string().allow(""),
      city_name: Joi.string().allow(""),
      address: Joi.string(),
      postal_code: Joi.string(),
      general_phone: Joi.string(),
      general_email: Joi.string(),
      created_at: Joi.string(),
      phone_code: Joi.string(),
    }),
  }) as any,
  getList: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      locations: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          business_name: Joi.string(),
          functional_types: Joi.array().items({
            id: Joi.string(),
            name: Joi.string(),
          }),
          country_name: Joi.string(),
          state_name: Joi.string().allow(""),
          city_name: Joi.string().allow(""),
          general_phone: Joi.string(),
          general_email: Joi.string(),
          created_at: Joi.string(),
          phone_code: Joi.string(),
          teams: Joi.number(),
        })
      ),
      pagination: Joi.object({
        page: Joi.number(),
        page_size: Joi.number(),
        total: Joi.number(),
        page_count: Joi.number(),
      }),
    }),
  }) as any,
  getListWithGroup: Joi.object({
    statusCode: Joi.number(),
    data: Joi.array().items({
      country_name: Joi.string(),
      count: Joi.number(),
      locations: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          business_name: Joi.string(),
          functional_types: Joi.array().items({
            id: Joi.string(),
            name: Joi.string(),
          }),
          country_name: Joi.string(),
          state_name: Joi.string().allow(""),
          city_name: Joi.string().allow(""),
          general_phone: Joi.string(),
          general_email: Joi.string(),
          created_at: Joi.string(),
          phone_code: Joi.string(),
          postal_code: Joi.string(),
          address: Joi.string(),
        })
      ),
    }),
  }) as any,
};
