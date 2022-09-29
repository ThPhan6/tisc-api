import HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));

const locationData = Joi.object({
  id: Joi.string(),
  business_name: Joi.string(),
  functional_types: Joi.array().items({
    id: Joi.string(),
    name: Joi.string(),
  }),
  functional_type: Joi.any(),
  country_name: Joi.string().allow(""),
  state_name: Joi.any(),
  city_name: Joi.any(),
  general_phone: Joi.string().allow(""),
  general_email: Joi.string().allow(""),
  created_at: Joi.string(),
  phone_code: Joi.string().allow(""),
  teams: Joi.number(),
  address: Joi.string().allow(null),
  business_number: Joi.string().allow(null),
  city_id: Joi.string().allow(null),
  country_id: Joi.string().allow(null),
  functional_type_ids: Joi.array().items(Joi.string().allow(null)),
  postal_code: Joi.string().allow(null),
  relation_id: Joi.string().allow(null),
  state_id: Joi.string().allow(null),
  type: Joi.number().allow(null),
})

export default {
  getOne: Joi.object({
    statusCode: Joi.number(),
    data: locationData
  }) as any,
  getList: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      locations: Joi.array().items(locationData),
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
      locations: Joi.array().items(locationData),
    }),
  }) as any,
};
