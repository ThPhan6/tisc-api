import * as Joi from "joi";
import { requireStringValidation } from "@/validates/common.validate";

export default {
  getSelectedSpecification: {
    params: {
      id: requireStringValidation("Product Id"),
    },
  },
  selectSpecification: {
    params: {
      id: requireStringValidation("Product Id"),
    },
    payload: {
      specification: Joi.object({
        is_refer_document: Joi.boolean(),
        attribute_groups: Joi.array().items(
          Joi.object({
            id: Joi.string(),
            configuration_steps: Joi.array().items(
              Joi.object({
                step_id: Joi.string(),
                options: Joi.array().items({
                  id: Joi.string(),
                  quantity: Joi.number().min(1),
                  pre_option: Joi.any(),
                }),
              })
            ),
            attributes: Joi.array().items(
              Joi.object({
                id: requireStringValidation("Attribute id"),
                basis_option_id: requireStringValidation("Basis option id"),
              })
            ),
          })
        ),
      }),
      custom_product: Joi.boolean().allow(null),
      brand_location_id: Joi.string().allow(""),
      distributor_location_id: Joi.string().allow(""),
    },
  },
};
