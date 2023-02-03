import Joi from "joi";
import {
  errorMessage,
  getListValidation,
  orderValidation,
  requireStringValidation,
} from "@/validate/common.validate";

const requireUnitValue = (item: any, helpers: any) => {
  if (
    (item.unit_1 !== '' && item.value_1 === '') ||
    (item.unit_2 !== '' && item.value_2 === '') ||
    (
      item.unit_1 === '' && item.value_1 === '' &&
      item.unit_2 === '' && item.value_2 === '')
  ) {
    return helpers.error("any.invalid");
  }
  return item;
}

const basisOptionsValidate = Joi.array()
  .items(
    Joi.object({
      image: Joi.string().when("....is_have_image", {
        is: true,
        then: Joi.optional().allow(""),
        otherwise: Joi.optional().allow(""),
      }),
      value_1: Joi.string().allow(""),
      value_2: Joi.string().allow(""),
      unit_1: Joi.string().allow(""),
      unit_2: Joi.string().allow(""),
      id: Joi.string().allow(""),
    })
    .custom(requireUnitValue)
  )
  .required()
  .error(errorMessage("Basis option value is required"))
  .custom((value) => {
    return value.map((item: any) => {
      return {
        ...item,
        image: item.image || "/default/option_default.webp",
      };
    });
  });

const basisPresetValidation = Joi.array()
  .items(
      Joi.object({
      value_1: Joi.string().allow(""),
      value_2: Joi.string().allow(""),
      unit_1: Joi.string().allow(""),
      unit_2: Joi.string().allow(""),
    })
    .custom(requireUnitValue)
  )
  .required()
  .error(errorMessage("Basis preset value is required"));



export default {
  createBasisConversion: {
    payload: {
      name: requireStringValidation("Basis conversion group name"),
      subs: Joi.array()
        .items(
          Joi.object({
            name_1: Joi.string(),
            name_2: Joi.string(),
            formula_1: Joi.number(),
            formula_2: Joi.number(),
            unit_1: Joi.string(),
            unit_2: Joi.string(),
          })
        )
        .required()
        .error(errorMessage("Basis conversion sub-group name is required")),
    },
  },
  updateBasisConversion: {
    params: {
      id: requireStringValidation("Basis conversion id"),
    },
    payload: {
      name: requireStringValidation("Basis conversion group name"),
      subs: Joi.array()
        .items(
          Joi.object({
            id: Joi.string(),
            name_1: Joi.string(),
            name_2: Joi.string(),
            formula_1: Joi.number(),
            formula_2: Joi.number(),
            unit_1: Joi.string(),
            unit_2: Joi.string(),
          })
        )
        .required()
        .error(errorMessage("Basis conversion sub-group is required")),
    },
  },
  createBasisOption: {
    payload: {
      name: requireStringValidation("Basis option group name"),
      subs: Joi.array().items({
        name: Joi.string()
          .trim()
          .required()
          .error(errorMessage("Basis option sub-group name is required")),
        is_have_image: Joi.valid(true, false),
        subs: basisOptionsValidate,
      }),
    },
  },
  updateBasisOption: {
    params: {
      id: requireStringValidation("Basis option id"),
    },
    payload: {
      name: requireStringValidation("Basis option group name"),
      subs: Joi.array().items({
        id: Joi.string(),
        name: requireStringValidation("Basis option sub-group name"),
        is_have_image: Joi.valid(true, false),
        subs: basisOptionsValidate,
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
      group_order: value.group_order || "ASC",
      option_order: value.option_order || "ASC",
    }),
  }),
  createBasisPreset: {
    payload: {
      name: requireStringValidation("Basis preset group name"),
      subs: Joi.array().items({
        name: requireStringValidation("Basis preset sub-group name"),
        subs: basisPresetValidation
      }),
    },
  },
  updateBasisPreset: {
    params: {
      id: requireStringValidation("Basis preset"),
    },
    payload: {
      name: requireStringValidation("Basis group name"),
      subs: Joi.array().items({
        id: Joi.string(),
        name: requireStringValidation("Basis preset sub-group name"),
        subs: basisPresetValidation
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
      group_order: value.group_order || "ASC",
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
      conversion_group_order: value.conversion_group_order || "ASC",
      conversion_between_order: value.conversion_between_order || "ASC",
    }),
  }),
};
