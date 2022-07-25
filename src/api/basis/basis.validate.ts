import * as Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";

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
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Basis conversion group name is missing"
          )
        ),
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
        .error(
          commonFailValidatedMessageFunction(
            "Basis conversion sub-group name is missing"
          )
        ),
    },
  },
  updateBasisConversion: {
    params: {
      id: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Basis conversion id is required")
        ),
    },
    payload: {
      name: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Basis conversion group name is missing"
          )
        ),
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
        .error(
          commonFailValidatedMessageFunction(
            "Basis conversion sub-group is missing"
          )
        ),
    },
  },
  createBasisOption: {
    payload: {
      name: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Basis option group name is missing"
          )
        ),
      subs: Joi.array()
        .items({
          name: Joi.string()
            .trim()
            .required()
            .error(
              commonFailValidatedMessageFunction(
                "Basis option sub-group name is missing"
              )
            ),
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
            .error(
              commonFailValidatedMessageFunction(
                "Basis option value is missing"
              )
            ),
        })
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Basis option sub-group is missing"
          )
        ),
    },
  },
  updateBasisOption: {
    params: {
      id: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Basis option id is required")
        ),
    },
    payload: {
      name: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Basis option group name is missing"
          )
        ),
      subs: Joi.array()
        .items({
          id: Joi.string(),
          name: Joi.string()
            .required()
            .error(
              commonFailValidatedMessageFunction(
                "Basis option sub-group name is missing"
              )
            ),
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
            .error(
              commonFailValidatedMessageFunction(
                "Basis option value is missing"
              )
            ),
        })
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Basis option sub-group is missing"
          )
        ),
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
        .error(commonFailValidatedMessageFunction("Page must be an integer")),
      pageSize: Joi.number()
        .min(1)
        .custom((value, helpers) => {
          if (!Number.isInteger(value)) return helpers.error("any.invalid");
          return value;
        })
        .error(
          commonFailValidatedMessageFunction("Page Size must be an integer")
        ),
      filter: Joi.string()
        .custom((value, helpers) => {
          return customFilter(value, helpers);
        }, "custom filter validation")
        .error(commonFailValidatedMessageFunction("Invalid filter")),
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
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Basis preset group name is missing"
          )
        ),
      subs: Joi.array()
        .items({
          name: Joi.string()
            .trim()
            .required()
            .error(
              commonFailValidatedMessageFunction(
                "Basis preset sub-group name is missing"
              )
            ),
          subs: Joi.array()
            .items({
              value_1: Joi.string(),
              value_2: Joi.string(),
              unit_1: Joi.string(),
              unit_2: Joi.string(),
            })
            .required()
            .error(
              commonFailValidatedMessageFunction(
                "Basis preset value is missing"
              )
            ),
        })
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Basis preset sub-group is missing"
          )
        ),
    },
  },
  updateBasisPreset: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Basis preset is missing")),
    },
    payload: {
      name: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction("Basis group name is missing")
        ),
      subs: Joi.array()
        .items({
          id: Joi.string(),
          name: Joi.string()
            .trim()
            .required()
            .error(
              commonFailValidatedMessageFunction(
                "Basis preset sub-group name is missing"
              )
            ),
          subs: Joi.array()
            .items({
              id: Joi.string(),
              value_1: Joi.string(),
              value_2: Joi.string(),
              unit_1: Joi.string(),
              unit_2: Joi.string(),
            })
            .required()
            .error(
              commonFailValidatedMessageFunction(
                "Basis preset value is missing"
              )
            ),
        })
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Basis preset sub-group is missing"
          )
        ),
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
        .error(commonFailValidatedMessageFunction("Page must be an integer")),
      pageSize: Joi.number()
        .min(1)
        .custom((value, helpers) => {
          if (!Number.isInteger(value)) return helpers.error("any.invalid");
          return value;
        })
        .error(
          commonFailValidatedMessageFunction("Page Size must be an integer")
        ),
      filter: Joi.string()
        .custom((value, helpers) => {
          return customFilter(value, helpers);
        }, "custom filter validation")
        .error(commonFailValidatedMessageFunction("Invalid filter")),
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
        .error(commonFailValidatedMessageFunction("Page must be an integer")),
      pageSize: Joi.number()
        .min(1)
        .custom((value, helpers) => {
          if (!Number.isInteger(value)) return helpers.error("any.invalid");
          return value;
        })
        .error(
          commonFailValidatedMessageFunction("Page Size must be an integer")
        ),
      filter: Joi.string()
        .custom((value, helpers) => {
          return customFilter(value, helpers);
        }, "custom filter validation")
        .error(commonFailValidatedMessageFunction("Invalid filter")),
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
