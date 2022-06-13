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
      origin: Joi.any(),
      main_office: Joi.any(),
      satellites: Joi.number(),
      designers: Joi.number(),
      capacities: Joi.number(),
      projects: Joi.number(),
      live: Joi.number(),
      on_hold: Joi.number(),
      archived: Joi.number(),
      status: Joi.number(),
      status_key: Joi.any(),
      assign_team: Joi.any(),
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
