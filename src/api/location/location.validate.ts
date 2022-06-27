import * as Joi from "joi";
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
  getStates: {
    query: {
      country_id: Joi.string()
        .required()
        .error(getMessage("Country id is required")),
    },
  },
  getCities: {
    query: {
      country_id: Joi.string()
        .required()
        .error(getMessage("Country id is required")),
      state_id: Joi.string(),
    },
  },
  create: {
    payload: {
      business_name: Joi.string()
        .required()
        .error(getMessage("Business name is required")),
      business_number: Joi.string()
        .required()
        .error(getMessage("Business number is required")),
      functional_type_ids: Joi.array()
        .items(Joi.string())
        .required()
        .error(getMessage("Functional type ids is required")),
      country_id: Joi.string()
        .required()
        .error(getMessage("Country id is required")),
      state_id: Joi.string(),
      city_id: Joi.string().required().error(getMessage("City id is required")),
      address: Joi.string().required().error(getMessage("Address is required")),
      postal_code: Joi.string()
        .required()
        .error(getMessage("Postal code is required")),
      general_phone: Joi.string()
        .required()
        .error(getMessage("General phone is required")),
      general_email: Joi.string()
        .required()
        .error(getMessage("General email is required")),
    },
  },
  update: {
    params: {
      id: Joi.string().required().error(getMessage("Location id is required")),
    },
    payload: {
      business_name: Joi.string()
        .required()
        .error(getMessage("Business name is required")),
      business_number: Joi.string()
        .required()
        .error(getMessage("Business number is required")),
      functional_type_ids: Joi.array()
        .items(Joi.string())
        .required()
        .error(getMessage("Functional type ids is required")),
      country_id: Joi.string()
        .required()
        .error(getMessage("Country id is required")),
      state_id: Joi.string(),
      city_id: Joi.string().required().error(getMessage("City id is required")),
      address: Joi.string().required().error(getMessage("Address is required")),
      postal_code: Joi.string()
        .required()
        .error(getMessage("Postal code is required")),
      general_phone: Joi.string()
        .required()
        .error(getMessage("General phone is required")),
      general_email: Joi.string()
        .required()
        .error(getMessage("General email is required")),
    },
  },
  getList: {
    query: Joi.object({
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
        .error(getMessage("Invalid filter")),
      sort_name: Joi.string(),
      sort_order: Joi.string().valid("ASC", "DESC"),
    }).custom((value) => {
      return {
        limit: !value.page || !value.pageSize ? 10 : value.pageSize,
        offset:
          !value.page || !value.pageSize
            ? 0
            : (value.page - 1) * value.pageSize,
        filter: value.filter,
        sort_name: value.sort_name ? value.sort_name : "created_at",
        sort_order: value.sort_order ? value.sort_order : "ASC",
      };
    }),
  } as any,
};
