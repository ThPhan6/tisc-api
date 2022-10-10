import * as Joi from "joi";
import { commonFailValidatedMessageFunction } from "@/validate/common.validate";

export default {
  create: {
    payload: {
      name: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Material name is required")),
      subs: Joi.array().items({
        name: Joi.string()
          .required()
          .error(
            commonFailValidatedMessageFunction("Sub material name is required")
          ),
        codes: Joi.array().items({
          code: Joi.string()
            .required()
            .error(commonFailValidatedMessageFunction("Code is required")),
          description: Joi.string(),
        }),
      }),
    },
  },
  getWithDesignId: {
    query: Joi.object({
      design_id: Joi.string().allow(null),
      // .trim()
      // .required()
      // .error(commonFailValidatedMessageFunction("Design is required")),
      main_material_code_order: Joi.string().valid("ASC", "DESC"),
      sub_material_code_order: Joi.string().valid("ASC", "DESC"),
      material_code_order: Joi.string().valid("ASC", "DESC"),
    }).custom((value) => {
      return {
        design_id: value.design_id ? value.design_id : "",
        main_material_code_order: value.main_material_code_order
          ? value.main_material_code_order
          : "ASC",
        sub_material_code_order: value.sub_material_code_order
          ? value.sub_material_code_order
          : "ASC",
        material_code_order: value.material_code_order
          ? value.material_code_order
          : "ASC",
      };
    }),
  },

  update: {
    params: {
      id: Joi.string()
        .required()
        .error(() => new Error("Material code id is required")),
    },
    payload: {
      name: Joi.string()
        .trim()
        .required()
        .error(() => new Error("Main material code name is missing")),
      subs: Joi.array()
        .items(
          Joi.object({
            id: Joi.string().allow(null),
            name: Joi.string()
              .trim()
              .required()
              .error(() => new Error("Sub material code name is missing")),
            codes: Joi.array()
              .items({
                id: Joi.string().allow(null),
                code: Joi.string()
                  .trim()
                  .required()
                  .error(() => new Error("Code is missing")),
                description: Joi.string()
                  .trim()
                  .required()
                  .error(
                    commonFailValidatedMessageFunction("Description is missing")
                  ),
              })
              .required()
              .error(() => new Error("Code is missing")),
          })
        )
        .required()
        .error(() => new Error("Subs material code is missing")),
    },
  },
};
