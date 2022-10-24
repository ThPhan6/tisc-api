import { SYSTEM_TYPE } from "@/constants";
import {
  commonFailValidatedMessageFunction,
  getListV2,
} from "@/validate/common.validate";
import Joi from "joi";

export default {
  getMarketLocationsCountryGroup: {
    params: {
      product_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product id is required")),
    },
  },
  getBrandLocationsCountryGroup: {
    params: {
      brand_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Brand id is required")),
    },
  },
  getDesignLocationsCountryGroup: {
    params: {
      design_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Design id is required")),
    },
  },
  create: {
    payload: {
      business_name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Business name is required")),
      business_number: Joi.string()
        .required()
        .allow("")
        .error(
          commonFailValidatedMessageFunction("Business number is required")
        ),

      functional_type_ids: Joi.array()
        .items(
          Joi.string()
            .trim()
            .required()
            .error(
              commonFailValidatedMessageFunction("Functional type is required")
            )
        )
        .required()
        .error(
          commonFailValidatedMessageFunction("Functional type is required")
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
      general_phone: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("General phone is required")),
      general_email: Joi.string()
        .trim()
        .email()
        .required()
        .error(commonFailValidatedMessageFunction("General email is required")),
    },
  },
  update: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Location id is required")),
    },
    payload: {
      business_name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Business name is required")),
      business_number: Joi.string()
        // .required()
        .allow(""),
      // .error(
      //   commonFailValidatedMessageFunction("Business number is required")
      // ),
      functional_type_ids: Joi.array()
        .items(
          Joi.string()
            .trim()
            .required()
            .error(
              commonFailValidatedMessageFunction("Functional type is required")
            )
        )
        .required()
        .error(
          commonFailValidatedMessageFunction("Functional type is required")
        ),
      country_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Country id is required")),
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
      general_phone: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("General phone is required")),
      general_email: Joi.string()
        .trim()
        .email()
        .required()
        .error(commonFailValidatedMessageFunction("General email is required")),
    },
  },
  getList: getListV2,
};
