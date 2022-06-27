import * as Joi from "joi";
import { ATTRIBUTE_TYPES } from "../../constant/common.constant";
import { getMessage } from "../../validate/common.validate";

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
        .error(getMessage("Attribute type is required")),
      name: Joi.string()
        .required()
        .error(getMessage("Attribute group name is required")),
      subs: Joi.array()
        .items(
          Joi.object({
            name: Joi.string(),
            basis_id: Joi.string(),
          })
            .required()
            .error(getMessage("Attribute group item is required"))
        )
        .required()
        .error(
          getMessage("Attribute group items is required at least 1 valid data")
        ),
    },
  },
  update: {
    params: {
      id: Joi.string().required().error(getMessage("Attribute id is required")),
    },
    payload: {
      name: Joi.string()
        .required()
        .error(getMessage("Attribute group name is required")),
      subs: Joi.array()
        .items(
          Joi.object({
            id: Joi.any(),
            name: Joi.string(),
            basis_id: Joi.string(),
          })
            .required()
            .error(getMessage("Attribute group item is required"))
        )
        .required()
        .error(
          getMessage("Attribute group items is required at least 1 valid data")
        ),
    },
  },
  getListWithMultipleSort: {
    query: Joi.object({
      type: Joi.number()
        .valid(
          ATTRIBUTE_TYPES.GENERAL,
          ATTRIBUTE_TYPES.FEATURE,
          ATTRIBUTE_TYPES.SPECIFICATION
        )
        .error(getMessage("Attribute type is required")),
      page: Joi.number()
        .min(1)
        .custom((value, helpers) => {
          if (!Number.isInteger(value)) return helpers.error("any.invalid");
          return value;
        })
        .error(getMessage("Page must be an integer")),

      pageSize: Joi.number()
        .min(1)
        .custom((value, helpers) => {
          if (!Number.isInteger(value)) return helpers.error("any.invalid");
          return value;
        })
        .error(getMessage("Page Size must be an integer")),
      filter: Joi.string()
        .custom((value, helpers) => {
          return customFilter(value, helpers);
        }, "custom filter validation")
        .error(() => new Error("Invalid filter")),
      group_order: Joi.string().valid("ASC", "DESC"),
      attribute_order: Joi.string().valid("ASC", "DESC"),
      content_type_order: Joi.string().valid("ASC", "DESC"),
    }).custom((value) => {
      return {
        type: value.type,
        limit: !value.page || !value.pageSize ? 10 : value.pageSize,
        offset:
          !value.page || !value.pageSize
            ? 0
            : (value.page - 1) * value.pageSize,
        filter: value.filter,
        group_order: value.group_order ? value.group_order : "ASC",
        attribute_order: value.attribute_order
          ? value.attribute_order
          : undefined,
        content_type_order: value.content_type_order
          ? value.content_type_order
          : undefined,
      };
    }),
  } as any,
};
