import * as Joi from "joi";
import { ATTRIBUTE_TYPES } from "../../constant/common.constant";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";

const customFilter = (value: any, helpers: any) => {
  try {
    const filter = JSON.parse(decodeURIComponent(value));
    if (typeof filter === "object") {
      return filter;
    }
    return helpers.error("any.invalid");
  } catch (error) {
    return helpers.error("any.invalid");
  }
};
export default {
  create: {
    payload: {
      type: Joi.number()
        .valid(
          ATTRIBUTE_TYPES.GENERAL,
          ATTRIBUTE_TYPES.FEATURE,
          ATTRIBUTE_TYPES.SPECIFICATION
        )
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
};
