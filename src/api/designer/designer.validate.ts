import { ActiveStatus } from "@/types";
import Joi from "joi";

import {
  commonFailValidatedMessageFunction,
  getListValidation,
} from "../../validate/common.validate";
import { GetDesignFirmSort } from "./designer.type";

export default {
  getList: getListValidation({
    query: {
      sort: Joi.string().valid(
        "created_at",
        "name",
        "origin",
        "main_office"
      ) as Joi.Schema<GetDesignFirmSort>,
    },
  }),
  updateDesignStatus: {
    params: {
      id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Design is required")),
    },
    payload: {
      status: Joi.number()
        .valid(ActiveStatus.Active, ActiveStatus.Inactive)
        .required()
        .error(commonFailValidatedMessageFunction("Design status is required")),
    },
  },
  updateDesign: {
    params: {
      id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Design is required")),
    },
    payload: {
      name: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction("Design firm name is required")
        ),
      parent_company: Joi.string().allow(""),
      logo: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Logo is required")),
      slogan: Joi.string().allow(""),
      profile_n_philosophy: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Profile & Philosophy")),
      official_website: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction("Official website is required")
        ),
      capabilities: Joi.array().items(
        Joi.string()
          .trim()
          .required()
          .error(
            commonFailValidatedMessageFunction(
              "Design capabilities is required"
            )
          )
      ),
    },
  },
};
