import * as Joi from "joi";
const customFilter = (value: any, helpers: any) => {
  try {
    const filter = JSON.parse(decodeURIComponent(value));
    if (typeof filter === "object") {
      return filter;
    }
    return helpers.error("any.invalid");
  } catch (error) {
    return helpers.error("any.invalid");
  }
};
export default {
  createBasisConversion: {
    payload: {
      name: Joi.string()
        .required()
        .error(() => new Error("Basis conversion group name is required")),
      subs: Joi.array()
        .items(
          Joi.object({
            name_1: Joi.string(),
            name_2: Joi.string(),
            formula_1: Joi.string(),
            formula_2: Joi.string(),
            unit_1: Joi.string(),
            unit_2: Joi.string(),
          })
        )
        .required()
        .error(() => new Error("Basis conversion group item is required")),
    },
  },
  updateBasisConversion: {
    params: {
      id: Joi.string()
        .required()
        .error(() => new Error("Basis conversion id is required")),
    },
    payload: {
      name: Joi.string()
        .required()
        .error(() => new Error("Basis conversion group name is required")),
      subs: Joi.array()
        .items(
          Joi.object({
            id: Joi.string(),
            name_1: Joi.string(),
            name_2: Joi.string(),
            formula_1: Joi.string(),
            formula_2: Joi.string(),
            unit_1: Joi.string(),
            unit_2: Joi.string(),
          })
        )
        .required()
        .error(() => new Error("Basis conversion group item is required")),
    },
  },
  createBasisOption: {
    payload: {
      name: Joi.string()
        .required()
        .error(() => new Error("Basis option group name is required")),

      subs: Joi.array()
        .items({
          name: Joi.string()
            .required()
            .error(() => new Error("Basis option group item name is required")),
          is_have_image: Joi.valid(true, false),
          subs: Joi.array()
            .items({
              image: Joi.string().when("....is_have_image", {
                is: true,
                then: Joi.required(),
                otherwise: Joi.optional().allow(""),
              }),
              value_1: Joi.string(),
              value_2: Joi.string(),
              unit_1: Joi.string(),
              unit_2: Joi.string(),
            })
            .required()
            .error(() => new Error("Basis option value is required")),
        })
        .required()
        .error(() => new Error("Basis option group item is required")),
    },
  },
  updateBasisOption: {
    params: {
      id: Joi.string()
        .required()
        .error(() => new Error("Basis option id is required")),
    },
    payload: {
      name: Joi.string()
        .required()
        .error(() => new Error("Basis option group name is required")),
      subs: Joi.array()
        .items({
          id: Joi.string(),
          name: Joi.string()
            .required()
            .error(() => new Error("Basis option group item name is required")),
          is_have_image: Joi.valid(true, false),
          subs: Joi.array()
            .items({
              id: Joi.string(),
              image: Joi.string().when("....is_have_image", {
                is: true,
                then: Joi.required(),
                otherwise: Joi.optional().allow(""),
              }),
              value_1: Joi.string(),
              value_2: Joi.string(),
              unit_1: Joi.string(),
              unit_2: Joi.string(),
            })
            .required()
            .error(() => new Error("Basis option value is required")),
        })
        .required()
        .error(() => new Error("Basis option group item is required")),
    },
  },
  getListBasisOption: {
    query: Joi.object({
      page: Joi.number()
        .min(1)
        .custom((value, helpers) => {
          if (!Number.isInteger(value)) return helpers.error("any.invalid");
          return value;
        })
        .error(() => new Error("Page must be an integer")),
      pageSize: Joi.number()
        .min(1)
        .custom((value, helpers) => {
          if (!Number.isInteger(value)) return helpers.error("any.invalid");
          return value;
        })
        .error(() => new Error("Page Size must be an integer")),

      filter: Joi.string()
        .custom((value, helpers) => {
          return customFilter(value, helpers);
        }, "custom filter validation")
        .error(() => new Error("Invalid filter")),
      group_order: Joi.string().valid("ASC", "DESC"),
      option_order: Joi.string().valid("ASC", "DESC"),
    }).custom((value) => {
      return {
        limit: !value.page || !value.pageSize ? 10 : value.pageSize,
        offset:
          !value.page || !value.pageSize
            ? 0
            : (value.page - 1) * value.pageSize,
        filter: value.filter,
        group_order: value.group_order ? value.group_order : "ASC",
        option_order: value.option_order ? value.option_order : "ASC",
      };
    }),
  } as any,

  createBasisPreset: {
    payload: {
      name: Joi.string()
        .required()
        .error(() => new Error("Basis preset group name is required")),
      subs: Joi.array()
        .items({
          name: Joi.string()
            .required()
            .error(() => new Error("Basis preset group item name is required")),
          subs: Joi.array()
            .items({
              value_1: Joi.string(),
              value_2: Joi.string(),
              unit_1: Joi.string(),
              unit_2: Joi.string(),
            })
            .required()
            .error(() => new Error("Basis preset value is required")),
        })
        .required()
        .error(() => new Error("Basis preset group item is required")),
    },
  },
  updateBasisPreset: {
    params: {
      id: Joi.string()
        .required()
        .error(() => new Error("Basis preset id is required")),
    },
    payload: {
      name: Joi.string()
        .required()
        .error(() => new Error("Basis group name is required")),

      subs: Joi.array()
        .items({
          id: Joi.string(),
          name: Joi.string()
            .required()
            .error(() => new Error("Basis preset group item name is required")),
          subs: Joi.array()
            .items({
              id: Joi.string(),
              value_1: Joi.string(),
              value_2: Joi.string(),
              unit_1: Joi.string(),
              unit_2: Joi.string(),
            })
            .required()
            .error(() => new Error("Basis preset value is required")),
        })
        .required()
        .error(() => new Error("Basis preset group item is required")),
    },
  },
  getListBasisPreset: {
    query: Joi.object({
      page: Joi.number()
        .min(1)
        .custom((value, helpers) => {
          if (!Number.isInteger(value)) return helpers.error("any.invalid");
          return value;
        })
        .error(() => new Error("Page must be an integer")),
      pageSize: Joi.number()
        .min(1)
        .custom((value, helpers) => {
          if (!Number.isInteger(value)) return helpers.error("any.invalid");
          return value;
        })
        .error(() => new Error("Page Size must be an integer")),
      filter: Joi.string()
        .custom((value, helpers) => {
          return customFilter(value, helpers);
        }, "custom filter validation")
        .error(() => new Error("Invalid filter")),
      group_order: Joi.string().valid("ASC", "DESC"),
      preset_order: Joi.string().valid("ASC", "DESC"),
    }).custom((value) => {
      return {
        limit: !value.page || !value.pageSize ? 10 : value.pageSize,
        offset:
          !value.page || !value.pageSize
            ? 0
            : (value.page - 1) * value.pageSize,
        filter: value.filter,
        group_order: value.group_order ? value.group_order : "ASC",
        preset_order: value.preset_order ? value.preset_order : "ASC",
      };
    }),
  } as any,
  getListBasisConversion: {
    query: Joi.object({
      page: Joi.number()
        .min(1)
        .custom((value, helpers) => {
          if (!Number.isInteger(value)) return helpers.error("any.invalid");
          return value;
        })
        .error(() => new Error("Page must be an integer")),

      pageSize: Joi.number()
        .min(1)
        .custom((value, helpers) => {
          if (!Number.isInteger(value)) return helpers.error("any.invalid");
          return value;
        })
        .error(() => new Error("Page Size must be an integer")),
      filter: Joi.string()
        .custom((value, helpers) => {
          return customFilter(value, helpers);
        }, "custom filter validation")
        .error(() => new Error("Invalid filter")),
      conversion_group_order: Joi.string().valid("ASC", "DESC"),
      conversion_between_order: Joi.string().valid("ASC", "DESC"),
    }).custom((value) => {
      return {
        limit: !value.page || !value.pageSize ? 10 : value.pageSize,
        offset:
          !value.page || !value.pageSize
            ? 0
            : (value.page - 1) * value.pageSize,
        filter: value.filter,
        conversion_group_order: value.conversion_group_order
          ? value.conversion_group_order
          : "ASC",
        conversion_between_order: value.conversion_between_order
          ? value.conversion_between_order
          : "ASC",
      };
    }),
  } as any,
};
