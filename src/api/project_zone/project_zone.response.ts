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
      project_id: Joi.string(),
      name: Joi.string(),
      area: Joi.array().items(
        Joi.object({
          name: Joi.string(),
          room: Joi.array().items(
            Joi.object({
              room_name: Joi.string(),
              room_id: Joi.string(),
              room_size: Joi.number(),
              quantity: Joi.number(),
              sub_total: Joi.number(),
              room_size_unit: Joi.string(),
            })
          ),
        })
      ),
      created_at: Joi.string(),
    }),
    statusCode: Joi.number(),
  }) as any,
};
