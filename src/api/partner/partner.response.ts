import Joi from "joi";

const partnerResponse = Joi.object({
  id: Joi.string(),
  name: Joi.string(),
  website: Joi.string().allow(""),
  country_id: Joi.any(),
  country_name: Joi.any(),
  state_name: Joi.any(),
  state_id: Joi.any(),
  city_name: Joi.any(),
  city_id: Joi.any(),
  contact: Joi.string().allow(""),
  address: Joi.any(),
  postal_code: Joi.any(),
  phone: Joi.string(),
  email: Joi.string(),
  affiliation_name: Joi.any(),
  affiliation_id: Joi.string(),
  relation_name: Joi.any(),
  relation_id: Joi.string(),
  acquisition_name: Joi.any(),
  acquisition_id: Joi.string(),
  price_rate: Joi.number(),
  authorized_country_name: Joi.string(),
  authorized_country_ids: Joi.array().items(Joi.string()),
  authorized_countries: Joi.any(),
  coverage_beyond: Joi.boolean(),
  remark: Joi.string().allow(""),
  location_id: Joi.any(),
  brand_id: Joi.string(),
  phone_code: Joi.any(),
  created_at: Joi.string(),
  updated_at: Joi.string().allow(null),
});

export default {
  getOne: Joi.object({
    statusCode: Joi.number(),
    data: partnerResponse,
  }),
  getList: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      pagination: Joi.any(),
      partners: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
          country_name: Joi.any(),
          city_name: Joi.any(),
          contact: Joi.any(),
          affiliation_name: Joi.any(),
          relation_name: Joi.any(),
          acquisition_name: Joi.any(),
          price_rate: Joi.number(),
          authorized_country_name: Joi.string(),
          coverage_beyond: Joi.boolean(),
          created_at: Joi.string(),
          updated_at: Joi.string().allow(null),
        })
      ),
    }),
  }),
};
