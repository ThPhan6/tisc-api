import * as Joi from "joi";
import {
  orderValidation,
  requireStringValidation,
} from "@/validates/common.validate";

export default {
  create: {
    payload: {
      name: requireStringValidation("Material name"),
      subs: Joi.array().items({
        name: requireStringValidation("Sub-list name"),
        codes: Joi.array().items({
          code: requireStringValidation("Sub-list Code"),
          description: requireStringValidation("Sub-list description"),
        }),
      }),
    },
  },
  getWithDesignId: {
    query: Joi.object({
      design_id: Joi.string().allow(null),
      main_material_code_order: orderValidation,
      sub_material_code_order: orderValidation,
      material_code_order: orderValidation,
    }).custom((value) => {
      return {
        design_id: value.design_id ? value.design_id : "",
        main_material_code_order: value.main_material_code_order || "ASC",
        sub_material_code_order: value.sub_material_code_order || "ASC",
        material_code_order: value.material_code_order || "ASC",
      };
    }),
  },

  update: {
    params: {
      id: requireStringValidation("Material code id"),
    },
    payload: {
      name: requireStringValidation("Main material code name"),
      subs: Joi.array().items(
        Joi.object({
          id: Joi.string().allow(null),
          name: requireStringValidation("Sub-list name"),
          codes: Joi.array().items({
            id: Joi.string().allow(null),
            code: requireStringValidation("Sub-list Code"),
            description: requireStringValidation("Sub-list description"),
          }),
        })
      ),
    },
  },
};
