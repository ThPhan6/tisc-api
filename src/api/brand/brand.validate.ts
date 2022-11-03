import { getEnumValues } from "@/helper/common.helper";
import { ActiveStatus, GetUserGroupBrandSort } from "@/types";
import Joi from "joi";
import {
  commonFailValidatedMessageFunction,
  getListValidation,
} from "../../validate/common.validate";

export default {
  getList: getListValidation({
    query: {
      haveProduct: Joi.bool().allow(null),
      sort: Joi.valid(
        "name",
        "origin",
        "status"
      ) as Joi.Schema<GetUserGroupBrandSort>,
    },
  }),
  updateBrandProfile: {
    payload: {
      name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Brand name is required")),
      parent_company: Joi.string().trim().allow(""),
      slogan: Joi.string().trim().allow(""),
      mission_n_vision: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction("Mission and vision is required")
        ),
      official_websites: Joi.array()
        .items({
          country_id: Joi.string(),
          url: Joi.string(),
        })
        .required()
        .error(
          commonFailValidatedMessageFunction("Official website is required")
        ),
    },
  },
  invite: {
    payload: {
      email: Joi.string()
        .email()
        .required()
        .error(commonFailValidatedMessageFunction("email is required")),
    },
  },
  create: {
    payload: {
      name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Brand Name is required")),
      first_name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("First name is required")),
      last_name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Last name is required")),
      email: Joi.string()
        .email()
        .required()
        .error(commonFailValidatedMessageFunction("Email is required")),
    },
  },
  updateBrandStatus: {
    params: {
      id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Brand is required")),
    },
    payload: {
      status: Joi.number()
        .valid(...getEnumValues(ActiveStatus))
        .required()
        .error(commonFailValidatedMessageFunction("Status required")),
    },
  },
};
