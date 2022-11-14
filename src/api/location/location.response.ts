import HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));

export const locationBasicResponse = {
  id: Joi.string(),
  country_id: Joi.string(),
  country_name: Joi.string(),
  city_id: Joi.string().allow(null, ""),
  city_name: Joi.string().allow(null, ""),
  state_id: Joi.string().allow(null, ""),
  state_name: Joi.string().allow(null, ""),
  phone_code: Joi.string(),
  address: Joi.string(),
  business_name: Joi.string().allow(null, ""),
  business_number: Joi.string().allow(null, ""),
  postal_code: Joi.string().allow(null, ""),
  general_phone: Joi.string().allow(null, ""),
  general_email: Joi.string().allow(null, ""),
};

const locationData = Joi.object({
  functional_type_ids: Joi.array().items(Joi.string().allow(null, "")),
  functional_types: Joi.array()
    .items({
      id: Joi.string(),
      name: Joi.string(),
    })
    .allow(null, ""),
  functional_type: Joi.any(),
  teams: Joi.number(),
  relation_id: Joi.string().allow(null),
  type: Joi.number().allow(null),
  created_at: Joi.string(),
  updated_at: Joi.string().allow(null),
  ...locationBasicResponse,
});

export default {
  getOne: Joi.object({
    statusCode: Joi.number(),
    data: locationData,
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
