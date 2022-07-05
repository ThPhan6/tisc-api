import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));
export default {
  getOne: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      id: Joi.string(),
      brand_id: Joi.string(),
      name: Joi.string(),
      country_name: Joi.string(),
      country_id: Joi.string(),
      state_name: Joi.string(),
      state_id: Joi.string(),
      city_name: Joi.string(),
      city_id: Joi.string(),
      address: Joi.string(),
      postal_code: Joi.string(),
      first_name: Joi.string(),
      last_name: Joi.string(),
      gender: Joi.boolean(),
      email: Joi.string(),
      phone: Joi.string(),
      mobile: Joi.string(),
      authorized_country_ids: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
        })
      ),
      coverage_beyond: Joi.boolean(),
      created_at: Joi.string(),
    }),
  }) as any,
  getList: Joi.object({
    statusCode: Joi.number(),
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        brand_id: Joi.string(),
        name: Joi.string(),
        country_name: Joi.string(),
        country_id: Joi.string(),
        state_name: Joi.string(),
        state_id: Joi.string(),
        city_name: Joi.string(),
        city_id: Joi.string(),
        address: Joi.string(),
        postal_code: Joi.string(),
        first_name: Joi.string(),
        last_name: Joi.string(),
        gender: Joi.boolean(),
        email: Joi.string(),
        phone: Joi.string(),
        mobile: Joi.string(),
        authorized_country_ids: Joi.array().items(
          Joi.object({
            id: Joi.string(),
            name: Joi.string(),
          })
        ),
        coverage_beyond: Joi.boolean(),
        created_at: Joi.string(),
      })
    ),
  }) as any,
};
