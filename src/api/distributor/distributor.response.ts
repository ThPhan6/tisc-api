import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));
export default {
  getOne: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      id: Joi.string(),
      brand_id: Joi.string(),
      name: Joi.string(),
      location: Joi.object({
        country: Joi.object({
          id: Joi.string(),
          name: Joi.string(),
        }),
        state: Joi.object({
          id: Joi.string(),
          name: Joi.string(),
        }),
        city: Joi.object({
          id: Joi.any(),
          name: Joi.string(),
        }),
        address: Joi.string(),
      }),
      postal_code: Joi.string(),
      first_name: Joi.string(),
      last_name: Joi.string(),
      gender: Joi.boolean(),
      email: Joi.string(),
      phone: Joi.string(),
      mobile: Joi.string(),
      authorized_countries: Joi.array().items(
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
        location: Joi.object({
          country: Joi.object({
            id: Joi.string(),
            name: Joi.string(),
          }),
          state: Joi.object({
            id: Joi.string(),
            name: Joi.string(),
          }),
          city: Joi.object({
            id: Joi.any(),
            name: Joi.string(),
          }),
          address: Joi.string(),
        }),
        postal_code: Joi.string(),
        first_name: Joi.string(),
        last_name: Joi.string(),
        gender: Joi.boolean(),
        email: Joi.string(),
        phone: Joi.string(),
        mobile: Joi.string(),
        authorized_countries: Joi.array().items(
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
