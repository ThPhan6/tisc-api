import Joi from "joi";
import {
  errorMessage,
  getListValidation,
  orderValidation,
  requireNumberValidation,
  requireStringValidation,
} from "@/validates/common.validate";
import { BasisPresetType } from "./basis.type";

const requireUnitValue = (item: any, helpers: any) => {
  if (
    (item.unit_1 !== "" && item.value_1 === "") ||
    (item.unit_2 !== "" && item.value_2 === "") ||
    (item.unit_1 === "" &&
      item.value_1 === "" &&
      item.unit_2 === "" &&
      item.value_2 === "")
  ) {
    return helpers.error("any.invalid");
  }
  return item;
};

const basisOptionsValidate = Joi.array()
  .items(
    Joi.object({
      image: Joi.string().allow(null),
      value_1: Joi.string(),
      value_2: Joi.string().allow(""),
      unit_1: Joi.string().allow(""),
      unit_2: Joi.string().allow(""),
      product_id: Joi.string()
        .required()
        .error(errorMessage("Product ID is required")),
      id: Joi.string().allow(""),
    }).custom(requireUnitValue)
  )
  .required()
  .min(1)
  .error(errorMessage("Value option is required"))
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
      value_1: Joi.string(),
      value_2: Joi.string().allow(""),
      unit_1: Joi.string().allow(""),
      unit_2: Joi.string().allow(""),
    }).custom(requireUnitValue)
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
      brand_id: requireStringValidation("Brand"),
      name: requireStringValidation("Group option name"),
      subs: Joi.array()
        .items({
          name: requireStringValidation("Main option name"),
          subs: Joi.array()
            .items({
              name: Joi.string()
                .trim()
                .required()
                .error(errorMessage("Sub option name")),
              is_have_image: Joi.valid(true, false),
              subs: basisOptionsValidate,
            })
            .required()
            .min(1)
            .error(errorMessage("Sub option is required")),
        })
        .required()
        .min(1)
        .error(errorMessage("Main option is required")),
    },
  },
  updateBasisOption: {
    params: {
      id: requireStringValidation("Basis option id"),
    },
    payload: {
      name: requireStringValidation("Group option name"),
      subs: Joi.array()
        .items({
          id: Joi.string(),
          name: Joi.string(),
          subs: Joi.array()
            .items({
              id: Joi.string(),
              name: requireStringValidation("Sub option name"),
              is_have_image: Joi.valid(true, false),
              main_id: Joi.any(),
              subs: basisOptionsValidate,
            })
            .required()
            .min(1)
            .error(errorMessage("Sub option is required")),
        })
        .required()
        .min(1)
        .error(errorMessage("Main option is required")),
    },
  },
  getListBasisOption: getListValidation({
    noSorting: true,
    query: {
      group_order: orderValidation,
      main_order: orderValidation,
      option_order: orderValidation,
    },
    custom: (value) => ({
      group_order: value.group_order || "ASC",
      main_order: value.main_order || "ASC",
      option_order: value.option_order || "ASC",
    }),
  }),
  createBasisPreset: {
    payload: {
      name: requireStringValidation("Basis preset group name"),
      additional_type: Joi.number()
        .valid(BasisPresetType.general, BasisPresetType.feature)
        .allow(null),
      subs: Joi.array().items({
        name: requireStringValidation("Basis preset sub-group name"),
        subs: Joi.array().items({
          id: Joi.string(),
          name: requireStringValidation("Basis preset name"),
          subs: basisPresetValidation,
        }),
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
        subs: Joi.array().items({
          id: Joi.string(),
          name: requireStringValidation("Basis preset name"),
          subs: basisPresetValidation,
        }),
      }),
    },
  },
  changeIdType: {
    params: {
      mainId: requireStringValidation("Main group"),
    },
    payload: {
      id_format_type: requireNumberValidation("ID type"),
      
    },
  },
  getListBasisPreset: getListValidation({
    noSorting: true,
    query: {
      group_order: orderValidation,
      preset_order: orderValidation,
      sub_group_order: orderValidation,
      is_general: Joi.boolean(),
    },
    custom: (value) => ({
      group_order: value.group_order || "ASC",
      preset_order: value.preset_order || "ASC",
      sub_group_order: value.sub_group_order || "ASC",
      is_general: value.is_general === undefined ? true : value.is_general,
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
