import { ActiveStatus } from "@/types";
import Joi from "joi";

import {
  errorMessage,
  getListValidation,
  requireStringValidation,
} from "@/validates/common.validate";
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
      id: requireStringValidation("Design"),
    },
    payload: {
      status: Joi.number()
        .valid(ActiveStatus.Active, ActiveStatus.Inactive)
        .required()
        .error(errorMessage("Design status is required")),
    },
  },
  updateDesign: {
    params: {
      id: requireStringValidation("Design"),
    },
    payload: {
      name: requireStringValidation("Design firm name"),
      parent_company: Joi.string().allow(""),
      logo: requireStringValidation("Logo"),
      slogan: Joi.string().allow(""),
      profile_n_philosophy: requireStringValidation("Profile & Philosophy"),
      official_website: requireStringValidation("Official website"),
      capabilities: Joi.array().items(
        requireStringValidation("Design capabilities")
      ),
    },
  },
};
