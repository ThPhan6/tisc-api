import Joi from "joi";
import { commonFailValidatedMessageFunction } from "@/validate/common.validate";
import moment from 'moment';

export default {
  paramProjectId: {
    params: {
      project_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Project ID is required")),
    },
  },
  downloadProjectPdf: {
    params: {
      project_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Project ID is required")),
    },
    payload: {
      location_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Issuing Office is required")),
      issuing_for_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Issue For is required")),
      issuing_date: Joi.date()
        .required()
        .error(commonFailValidatedMessageFunction("Issue Date is required"))
        .custom((value) => {
          return moment(value).format('YYYY-MM-DD');
        }),
      revision: Joi.string().allow(""),
      has_cover: Joi.boolean(),
      document_title: Joi.string().allow("").max(50)
        .error(commonFailValidatedMessageFunction("Document Title max length is 50")),
      template_ids: Joi.array()
        .items(Joi.string().required())
        .error(
          commonFailValidatedMessageFunction(
            "Please select at least one template"
          )
        ),
    },
    query: {
      responseType: Joi.string().valid('stream', 'base64').allow('')
    }
  },
};
