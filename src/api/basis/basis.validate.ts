import * as Joi from "joi";
import {
  commonFailValidatedMessageFunction,
  getListValidation,
  orderValidation,
} from "../../validate/common.validate";

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
      subs: Joi.array().items({
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
            value_1: Joi.string().allow(""),
            value_2: Joi.string().allow(""),
            unit_1: Joi.string().allow(""),
            unit_2: Joi.string().allow(""),
          })
          .required()
          .error(
            commonFailValidatedMessageFunction("Basis option value is missing")
          ),
      }),
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
      subs: Joi.array().items({
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
            value_1: Joi.string().allow(""),
            value_2: Joi.string().allow(""),
            unit_1: Joi.string().allow(""),
            unit_2: Joi.string().allow(""),
          })
          .required()
          .error(
            commonFailValidatedMessageFunction("Basis option value is missing")
          ),
      }),
    },
  },
  getListBasisOption: getListValidation({
    noSorting: true,
    query: {
      group_order: orderValidation,
      option_order: orderValidation,
    },
    custom: (value) => ({
      group_order: value.group_order,
      option_order: value.option_order || "ASC",
    }),
  }),
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
      subs: Joi.array().items({
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
            value_1: Joi.string().allow(""),
            value_2: Joi.string().allow(""),
            unit_1: Joi.string().allow(""),
            unit_2: Joi.string().allow(""),
          })
          .required()
          .error(
            commonFailValidatedMessageFunction("Basis preset value is missing")
          ),
      }),
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
      subs: Joi.array().items({
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
            value_1: Joi.string().allow(""),
            value_2: Joi.string().allow(""),
            unit_1: Joi.string().allow(""),
            unit_2: Joi.string().allow(""),
          })
          .required()
          .error(
            commonFailValidatedMessageFunction("Basis preset value is missing")
          ),
      }),
    },
  },
  getListBasisPreset: getListValidation({
    noSorting: true,
    query: {
      group_order: orderValidation,
      preset_order: orderValidation,
    },
    custom: (value) => ({
      group_order: value.group_order,
      preset_order: value.preset_order || "ASC",
    }),
  }),
  getListBasisConversion: getListValidation({
    noSorting: true,
    query: {
      conversion_group_order: orderValidation,
      conversion_between_order: orderValidation,
    },
    custom: (value) => ({
      conversion_group_order: value.conversion_group_order,
      conversion_between_order: value.conversion_between_order || "ASC",
    }),
  }),
};
