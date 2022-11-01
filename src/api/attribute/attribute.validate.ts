import { getEnumValues } from "@/helper/common.helper";
import { AttributeType } from "@/types";
import * as Joi from "joi";
import {
  commonFailValidatedMessageFunction,
  getListValidation,
  orderValidation,
} from "../../validate/common.validate";

export default {
  create: {
    payload: {
      type: Joi.number()
        .valid(...getEnumValues(AttributeType))
        .required()
        .error(
          commonFailValidatedMessageFunction("Attribute type is required")
        ),
      name: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Attribute group name is required")
        ),
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
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Attribute id is required")),
    },
    payload: {
      name: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Attribute group name is required")
        ),
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
      attribute_order: orderValidation,
      content_type_order: orderValidation,
    },
    custom: (value) => ({
      type: value.type,
      group_order: value.group_order,
      attribute_order: value.attribute_order || "ASC",
      content_type_order: value.content_type_order || "ASC",
    }),
  }),
};
