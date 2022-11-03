import { getEnumValues } from "@/helper/common.helper";
import { ActiveStatus, GetUserGroupBrandSort } from "@/types";
import Joi from "joi";
import {
  errorMessage,
  getListValidation,
  requireEmailValidation,
  requireStringValidation,
} from "@/validate/common.validate";

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
      name: requireStringValidation("Brand name"),
      parent_company: Joi.string().trim().allow(""),
      slogan: Joi.string().trim().allow(""),
      mission_n_vision: requireStringValidation("Mission and vision"),
      official_websites: Joi.array()
        .items({
          country_id: Joi.string(),
          url: Joi.string(),
        })
        .required()
        .error(errorMessage("Official website is required")),
    },
  },
  invite: {
    payload: {
      email: requireEmailValidation(),
    },
  },
  create: {
    payload: {
      name: requireStringValidation("Brand Name"),
      first_name: requireStringValidation("First name"),
      last_name: requireStringValidation("Last name"),
      email: requireEmailValidation(),
    },
  },
  updateBrandStatus: {
    params: {
      id: requireStringValidation("Brand"),
    },
    payload: {
      status: Joi.number()
        .valid(...getEnumValues(ActiveStatus))
        .required()
        .error(errorMessage("Status required")),
    },
  },
};
