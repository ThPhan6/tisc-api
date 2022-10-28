import Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";
export default {
  paramProjectId: {
    params: {
      project_id: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Project ID is required")
        ),
    },
  },
  downloadProjectPdf: {
    params: {
      project_id: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Project ID is required")
        ),
    },
    payload: {
      location_id: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Location is required")
        ),
      issuing_for_id: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Issue For is required")
        ),
      issuing_date: Joi.date()
        .required()
        .error(
          commonFailValidatedMessageFunction("Issue Date is required")
        ),
      revision: Joi.string(),
      has_cover: Joi.boolean(),
      document_title: Joi.string(),
      template_ids: Joi.array().items(Joi.string().required()).error(
        commonFailValidatedMessageFunction("Please select at least one template")
      ),
    }
  }
};
