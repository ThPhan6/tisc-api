import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  category: Joi.object({
    data: Joi.object({
      id: Joi.string(),
      name: Joi.string(),
      subs: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
          subs: Joi.array().items(
            Joi.object({
              id: Joi.string(),
              name: Joi.string(),
            })
          ),
        })
      ),
      created_at: Joi.string(),
    }),
    statusCode: Joi.number(),
  }) as any,
  categories: Joi.object({
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        name: Joi.string(),
        subs: Joi.array().items(
          Joi.object({
            id: Joi.string(),
            name: Joi.string(),
            subs: Joi.array().items(
              Joi.object({
                id: Joi.string(),
                name: Joi.string(),
              })
            ),
          })
        ),
        created_at: Joi.string(),
      })
    ),
    statusCode: Joi.number(),
  }) as any,
};
