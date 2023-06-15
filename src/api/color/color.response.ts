import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));

export default {
  detectedData: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      recommendation_collection: {
        id: Joi.string(),
        name: Joi.string(),
      },
      images: Joi.array().items(
        Joi.object({
          name: Joi.any(),
          color_specification: Joi.array().items(Joi.any()),
        })
      ),
    }),
  }) as any,
};
