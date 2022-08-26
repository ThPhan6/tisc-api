import Joi from "joi";
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
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Brand id is required")),
      name: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction("Distributor Name is required")
        ),
      country_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Country is required")),
      state_id: Joi.string().trim().allow(""),
      city_id: Joi.string().trim().allow(""),
      address: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Address is required")),
      postal_code: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Postal code is required")),
      first_name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("First name is required")),
      last_name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Last name is required")),
      gender: Joi.boolean()
        .required()
        .valid(true, false)
        .error(commonFailValidatedMessageFunction("Gender is required")),
      email: Joi.string()
        .email()
        .required()
        .error(commonFailValidatedMessageFunction("Work email is required")),
      phone: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Work phone is required")),
      mobile: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Work mobile is required")),
      authorized_country_ids: Joi.array()
        .items(Joi.string().trim().required())
        .required()
        .error(
          commonFailValidatedMessageFunction("Authorized country is required")
        ),
      coverage_beyond: Joi.boolean()
        .required()
        .valid(true, false)
        .error(
          commonFailValidatedMessageFunction("Coverage beyond is required")
        ),
    },
  },

  update: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Id can not be empty")),
    },
    payload: {
      brand_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Brand id is required")),
      name: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction("Distributor Name is required")
        ),
      country_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Country is required")),
      state_id: Joi.string().trim().allow(""),
      city_id: Joi.string().trim().allow(""),
      address: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Address is required")),
      postal_code: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Postal code is required")),
      first_name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("First name is required")),
      last_name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Last name is required")),
      gender: Joi.boolean()
        .required()
        .valid(true, false)
        .error(commonFailValidatedMessageFunction("Gender is required")),
      email: Joi.string()
        .email()
        .required()
        .error(commonFailValidatedMessageFunction("Work email is required")),
      phone: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Work phone is required")),
      mobile: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Work mobile is required")),
      authorized_country_ids: Joi.array()
        .items(Joi.string().trim().required())
        .required()
        .error(
          commonFailValidatedMessageFunction("Authorized country is required")
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
        .trim()
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

      sort: Joi.string(),
      order: Joi.string().valid("ASC", "DESC"),
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
        sort: value.sort ? value.sort : "created_at",
        order: value.order ? value.order : "ASC",
        type: value.type,
      };
    }),
  } as any,
  getWithBrandId: {
    query: {
      brand_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Brand is required")),
    },
  },
  getMarketDistributorGroupByCountry: {
    params: {
      product_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product id is required")),
    },
  },
};
