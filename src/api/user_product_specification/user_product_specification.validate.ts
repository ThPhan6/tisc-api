import * as Joi from "joi";
import { requireStringValidation } from "@/validate/common.validate";

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
            attributes: Joi.array().items(
              Joi.object({
                id: requireStringValidation("Attribute id"),
                basis_option_id: requireStringValidation("Basis option id"),
              })
            ),
          })
        ),
      }),
      brand_location_id: Joi.string().allow(""),
      distributor_location_id: Joi.string().allow(""),
    },
  },
};
