import { DOCUMENTATION_TYPES } from "./../../constant/common.constant";
import * as Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";

export default {
  create: {
    payload: {
      title: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Title is required")),

      document: Joi.object({
        document: Joi.string(),
        question_and_answer: Joi.array().items({
          question: Joi.string(),
          answer: Joi.string(),
        }),
      })
        .required()
        .error(commonFailValidatedMessageFunction("Document is required")),
    },
  },
  getById: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Document id is required")),
    },
  },
  update: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Document id is required")),
    },
    payload: {
      title: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Title is required")),
      document: Joi.object({
        document: Joi.string(),
        question_and_answer: Joi.array().items({
          question: Joi.string(),
          answer: Joi.string(),
        }),
      })
        .required()
        .error(commonFailValidatedMessageFunction("Document is required")),
    },
  },

  getList: {
    query: Joi.object({
      type: Joi.number()
        .valid(
          DOCUMENTATION_TYPES.GENERAL,
          DOCUMENTATION_TYPES.TISC_HOW_TO,
          DOCUMENTATION_TYPES.BRAND_HOW_TO,
          DOCUMENTATION_TYPES.DESIGN_HOW_TO
        )
        .required()
        .error(
          commonFailValidatedMessageFunction("Documentation type is required")
        ),
      page: Joi.number()
        .min(1)
        .custom((value, helpers) => {
          if (!Number.isInteger(value)) return helpers.error("any.invalid");
          return value;
        })
        .error(commonFailValidatedMessageFunction("Page must be an integer")),

      pageSize: Joi.number()
        .min(1)
        .custom((value, helpers) => {
          if (!Number.isInteger(value)) return helpers.error("any.invalid");
          return value;
        })
        .error(
          commonFailValidatedMessageFunction("Page Size must be an integer")
        ),

      sort: Joi.string(),
      order: Joi.string().valid("ASC", "DESC"),
    }).custom((value) => {
      return {
        limit: !value.page || !value.pageSize ? 10 : value.pageSize,
        offset:
          !value.page || !value.pageSize
            ? 0
            : (value.page - 1) * value.pageSize,
        sort: value.sort ? [value.sort, value.order] : undefined,
        type: value.type,
      };
    }),
  } as any,
};
