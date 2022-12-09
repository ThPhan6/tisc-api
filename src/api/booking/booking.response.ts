import HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
    availableSchedule: Joi.object({
    data: Joi.array().items(
        Joi.object({
          start: Joi.string(),
          end: Joi.string(),
          available: Joi.boolean(),
          slot: Joi.number(),
        })
      ),
    statusCode: Joi.number(),
  }) as any,
  getOne: Joi.object({
    data: Joi.object({
      id: Joi.string(),
      event_id: Joi.string(),
      brand_id: Joi.string(),
      website: Joi.string().allow(null, ''),
      name: Joi.string().allow(null, ''),
      brand_name: Joi.string().allow(null, ''),
      meeting_url: Joi.string(),
      email: Joi.string(),
      date: Joi.string(),
      slot: Joi.number(),
      timezone: Joi.string(),
      timezone_text: Joi.string(),
      start_time_text: Joi.string(),
      end_time_text: Joi.string(),
      created_at: Joi.string(),
      updated_at: Joi.string(),
    }),
    statusCode: Joi.number(),
  })
};
