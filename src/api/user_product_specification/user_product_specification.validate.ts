import * as Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";

export default {
  getSelectedSpecification: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product Id is required")),
    },
  },
  selectSpecification: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product Id is required")),
    },
    payload: {
      specification: Joi.object({
        is_refer_document: Joi.boolean(),
        attribute_groups: Joi.array().items(
          Joi.object({
            id: Joi.string(),
            attributes: Joi.array().items(
              Joi.object({
                id: Joi.string().required(),
                basis_option_id: Joi.string().required(),
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
