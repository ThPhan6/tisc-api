import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  basisConversion: Joi.object({
    data: Joi.object({
      id: Joi.string(),
      name: Joi.string(),
      subs: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name_1: Joi.string(),
          name_2: Joi.string(),
          forumla_1: Joi.number(),
          forumla_2: Joi.number(),
          unit_1: Joi.string(),
          unit_2: Joi.string(),
          conversion_between: Joi.string(),
          first_forumla: Joi.string(),
          second_forumla: Joi.string(),
        })
      ),
      created_at: Joi.string(),
    }),
    statusCode: Joi.number(),
  }) as any,

  basisConversions: Joi.object({
    data: {
      basis_conversions: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
          count: Joi.number(),
          subs: Joi.array().items(
            Joi.object({
              id: Joi.string(),
              name_1: Joi.string(),
              name_2: Joi.string(),
              forumla_1: Joi.number(),
              forumla_2: Joi.number(),
              unit_1: Joi.string(),
              unit_2: Joi.string(),
              conversion_between: Joi.string(),
              first_forumla: Joi.string(),
              second_forumla: Joi.string(),
            })
          ),
          created_at: Joi.string(),
        })
      ),
      conversion_group_count: Joi.number(),
      conversion_count: Joi.number(),
    },
    statusCode: Joi.number(),
  }) as any,

  basisOption: Joi.object({
    data: {
      id: Joi.string(),
      name: Joi.string(),
      count: Joi.number(),
      subs: Joi.array().items({
        id: Joi.string(),
        name: Joi.string(),
        count: Joi.number(),
        subs: Joi.array().items({
          id: Joi.string(),
          image: Joi.any(),
          value_1: Joi.string(),
          value_2: Joi.string(),
          unit_1: Joi.string(),
          unit_2: Joi.string(),
        }),
      }),
      created_at: Joi.string(),
    },
    statusCode: Joi.number(),
  }) as any,
  basesOption: Joi.object({
    data: {
      basis_options: Joi.array().items({
        id: Joi.string(),
        name: Joi.string(),
        count: Joi.number(),
        subs: Joi.array().items({
          id: Joi.string(),
          name: Joi.string(),
          count: Joi.number(),
          subs: Joi.array().items({
            id: Joi.string(),
            image: Joi.any(),
            value_1: Joi.string(),
            value_2: Joi.string(),
            unit_1: Joi.string(),
            unit_2: Joi.string(),
          }),
        }),
        created_at: Joi.string(),
      }),
      group_count: Joi.number(),
      option_count: Joi.number(),
      value_count: Joi.number(),
    },
    statusCode: Joi.number(),
  }) as any,
};
