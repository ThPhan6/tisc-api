import * as Joi from "joi";
import { ORDER_METHOD } from "../../constant/common.constant";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";

export default {
  getOne: {
    params: {
      considered_product_id: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Considered Product is required")
        ),
    },
  },
  specify: {
    payload: {
      considered_product_id: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Considered Product is required")
        ),
      specification: Joi.object({
        is_refer_document: Joi.boolean()
          .valid(true, false)
          .required()
          .error(
            commonFailValidatedMessageFunction(
              "Is refer to document is required"
            )
          ),
        specification_attribute_groups: Joi.array().items({
          id: Joi.string(),
          attributes: Joi.array().items({
            id: Joi.string(),
            basis_option_id: Joi.string(),
          }),
        }),
      }),
      brand_location_id: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Brand location is required")
        ),
      distributor_location_id: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Distributor location is required")
        ),

      is_entire: Joi.boolean()
        .valid(true, false)
        .required()
        .error(
          commonFailValidatedMessageFunction("Distributor location is required")
        ),
      project_zone_ids: Joi.array().items(Joi.string()),
      material_code_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Material code is required")),
      suffix_code: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Suffix code is required")),
      description: Joi.string(),
      quantity: Joi.number()
        .required()
        .error(commonFailValidatedMessageFunction("Quantity is required")),
      unit_type_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Unit type is required")),
      order_method: Joi.number()
        .valid(ORDER_METHOD.DIRECT_PURCHASE, ORDER_METHOD.CUSTOM_ORDER)
        .required()
        .error(commonFailValidatedMessageFunction("Order method is required")),
      requirement_type_ids: Joi.array().items(
        Joi.string()
          .required()
          .error(
            commonFailValidatedMessageFunction("Requirement type is required")
          )
      ),
      instruction_type_ids: Joi.array().items(
        Joi.string()
          .required()
          .error(
            commonFailValidatedMessageFunction("Instruction type is required")
          )
      ),
    },
  },
};
