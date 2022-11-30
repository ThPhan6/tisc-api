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
};
