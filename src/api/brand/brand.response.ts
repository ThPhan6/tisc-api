import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  getList: Joi.object({
    data: Joi.array().items({
      id: Joi.string(),
      name: Joi.string(),
      logo: Joi.string(),
      origin: Joi.string(),
      locations: Joi.number(),
      teams: Joi.number(),
      distributors: Joi.number(),
      coverages: Joi.number(),
      categories: Joi.number(),
      collections: Joi.number(),
      cards: Joi.number(),
      products: Joi.number(),
      assign_team: Joi.any(),
      status: Joi.number(),
      created_at: Joi.string(),
      updated_at: Joi.string().allow(null),
    }),
    statusCode: Joi.number(),
  }) as any,
  getOne: Joi.object({
    data: Joi.any(),
    statusCode: Joi.number(),
  }) as any,
};
