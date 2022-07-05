import * as Joi from "joi";
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
      brand_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Brand id is required")),
      name: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Distributor Name is required")
        ),
      location: {
        country_id: Joi.string()
          .required()
          .error(commonFailValidatedMessageFunction("Country is required")),
        state_id: Joi.string()
          .required()
          .error(commonFailValidatedMessageFunction("State is required")),
        city_id: Joi.string()
          .required()
          .error(commonFailValidatedMessageFunction("City is required")),
        address: Joi.string()
          .required()
          .error(commonFailValidatedMessageFunction("Address is required")),
      },
      postal_code: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Postal code is required")),
      first_name: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("First name is required")),
      last_name: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Last name is required")),
      gender: Joi.boolean()
        .required()
        .valid(true, false)
        .error(commonFailValidatedMessageFunction("Gender is required")),
      email: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Work email is required")),
      phone: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Work phone is required")),
      mobile: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Work mobile is required")),
      authorized_country_ids: Joi.array()
        .items(Joi.string())
        .required()
        .error(
          commonFailValidatedMessageFunction("authorized country is required")
        ),
      coverage_beyond: Joi.boolean()
        .required()
        .valid(true, false)
        .error(
          commonFailValidatedMessageFunction("Coverage beyond is required")
        ),
    },
  },
  getOne: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Id can not be empty")),
    },
    query: Joi.object({
      brand_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Brand id is required")),
    }),
  },

  update: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Id can not be empty")),
    },
    query: Joi.object({
      brand_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Brand id is required")),
    }),
    payload: {
      brand_id: Joi.string(),
      name: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Distributor Name is required")
        ),
      location: {
        country_id: Joi.string()
          .required()
          .error(commonFailValidatedMessageFunction("Country is required")),
        state_id: Joi.string()
          .required()
          .error(commonFailValidatedMessageFunction("State is required")),
        city_id: Joi.string()
          .required()
          .error(commonFailValidatedMessageFunction("City is required")),
        address: Joi.string()
          .required()
          .error(commonFailValidatedMessageFunction("Address is required")),
      },
      postal_code: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Postal code is required")),
      first_name: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("First name is required")),
      last_name: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Last name is required")),
      gender: Joi.boolean()
        .required()
        .valid(true, false)
        .error(commonFailValidatedMessageFunction("Gender is required")),
      email: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Work email is required")),
      phone: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Work phone is required")),
      mobile: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Work mobile is required")),
      authorized_country_ids: Joi.array()
        .items(Joi.string())
        .required()
        .error(
          commonFailValidatedMessageFunction("authorized country is required")
        ),
      coverage_beyond: Joi.boolean()
        .required()
        .valid(true, false)
        .error(
          commonFailValidatedMessageFunction("Coverage beyond is required")
        ),
    },
  },
  getList: {
    query: Joi.object({
      brand_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Brand id is required")),
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

      sort_name: Joi.string(),
      sort_order: Joi.string().valid("ASC", "DESC"),
      filter: Joi.string()
        .custom((value, helpers) => {
          return customFilter(value, helpers);
        }, "custom filter validation")
        .error(commonFailValidatedMessageFunction("Invalid filter")),
    }).custom((value) => {
      return {
        brand_id: value.brand_id,
        limit: !value.page || !value.pageSize ? 10 : value.pageSize,
        offset:
          !value.page || !value.pageSize
            ? 0
            : (value.page - 1) * value.pageSize,
        filter: value.filter,
        sort_name: value.sort_name ? value.sort_name : "created_at",
        sort_order: value.sort_order ? value.sort_order : "ASC",
        type: value.type,
      };
    }),
  } as any,
};
