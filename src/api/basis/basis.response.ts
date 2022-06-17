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
          formula_1: Joi.string(),
          formula_2: Joi.string(),
          unit_1: Joi.string(),
          unit_2: Joi.string(),
          conversion_between: Joi.string(),
          first_formula: Joi.string(),
          second_formula: Joi.string(),
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
              formula_1: Joi.string(),
              formula_2: Joi.string(),
              unit_1: Joi.string(),
              unit_2: Joi.string(),
              conversion_between: Joi.string(),
              first_formula: Joi.string(),
              second_formula: Joi.string(),
            })
          ),
          created_at: Joi.string(),
        })
      ),
      summary: Joi.array().items(
        Joi.object({
          name: Joi.string(),
          value: Joi.number(),
        })
      ),
      pagination: Joi.object({
        page: Joi.number(),
        page_size: Joi.number(),
        total: Joi.number(),
        page_count: Joi.number(),
      }),
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
      basis_options: Joi.array().items(
        Joi.object({
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
        })
      ),
      summary: Joi.array().items(
        Joi.object({
          name: Joi.string(),
          value: Joi.number(),
        })
      ),
      pagination: Joi.object({
        page: Joi.number(),
        page_size: Joi.number(),
        total: Joi.number(),
        page_count: Joi.number(),
      }),
    },
    statusCode: Joi.number(),
  }) as any,
  basisPreset: Joi.object({
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
  basisPresets: Joi.object({
    data: {
      basis_presets: Joi.array().items({
        id: Joi.string(),
        name: Joi.string(),
        count: Joi.number(),
        subs: Joi.array().items({
          id: Joi.string(),
          name: Joi.string(),
          count: Joi.number(),
          subs: Joi.array().items({
            id: Joi.string(),
            value_1: Joi.string().allow(""),
            value_2: Joi.string().allow(""),
            unit_1: Joi.string().allow(""),
            unit_2: Joi.string().allow(""),
          }),
        }),
        created_at: Joi.string(),
      }),
      count: {
        group_count: Joi.number(),
        preset_count: Joi.number(),
        value_count: Joi.number(),
      },
      summary: Joi.array().items(
        Joi.object({
          name: Joi.string(),
          value: Joi.number(),
        })
      ),
      pagination: Joi.object({
        page: Joi.number(),
        page_size: Joi.number(),
        total: Joi.number(),
        page_count: Joi.number(),
      }),
    },
    statusCode: Joi.number(),
  }) as any,
};
