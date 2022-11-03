import { getEnumValues } from "@/helper/common.helper";
import { AttributeType } from "@/types";
import {
  commonFailValidatedMessageFunction,
  getListValidation,
  orderValidation,
  requireStringValidation,
} from "@/validate/common.validate";
import * as Joi from "joi";

export default {
  create: {
    payload: {
      type: Joi.number()
        .valid(...getEnumValues(AttributeType))
        .required()
        .error(
          commonFailValidatedMessageFunction("Attribute type is required")
        ),
      name: requireStringValidation("Attribute group name"),
      subs: Joi.array()
        .items(
          Joi.object({
            name: Joi.string(),
            basis_id: Joi.string(),
          })
            .required()
            .error(
              commonFailValidatedMessageFunction(
                "Attribute group item is required"
              )
            )
        )
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Attribute group items is required at least 1 valid data"
          )
        ),
    },
  },
  update: {
    params: {
      id: requireStringValidation("Attribute id"),
    },
    payload: {
      name: requireStringValidation("Attribute group name"),
      subs: Joi.array()
        .items(
          Joi.object({
            id: Joi.any(),
            name: Joi.string(),
            basis_id: Joi.string(),
          })
            .required()
            .error(
              commonFailValidatedMessageFunction(
                "Attribute group item is required"
              )
            )
        )
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Attribute group items is required at least 1 valid data"
          )
        ),
    },
  },
  getListWithMultipleSort: getListValidation({
    noSorting: true,
    query: {
      type: Joi.number()
        .valid(...getEnumValues(AttributeType))
        .error(
          commonFailValidatedMessageFunction("Attribute type is required")
        ),
      group_order: orderValidation,
      // attribute_order & content_type_order are the same level
      // just sort one at a time
      attribute_order: orderValidation,
      content_type_order: orderValidation,
    },
  }),
};
