import Joi from "joi";
import {
  errorMessage,
  requireStringValidation,
} from "@/validates/common.validate";
import moment from "moment";

export default {
  paramProjectId: {
    params: {
      project_id: requireStringValidation("Project ID"),
    },
  },
  downloadProjectPdf: {
    params: {
      project_id: requireStringValidation("Project ID"),
    },
    payload: {
      location_id: requireStringValidation("Issuing Office"),
      issuing_for_id: requireStringValidation("Issue For"),
      issuing_date: Joi.date()
        .required()
        .error(errorMessage("Issue Date is required"))
        .custom((value) => {
          return moment(value).format("YYYY-MM-DD");
        }),
      revision: Joi.string().allow(""),
      has_cover: Joi.boolean(),
      document_title: Joi.string()
        .allow("")
        .max(50)
        .error(errorMessage("Document Title max length is 50")),
      template_ids: Joi.array()
        .items(Joi.string().required())
        .error(errorMessage("Please select at least one template")),
    },
    query: {
      responseType: Joi.string().valid("stream", "base64").allow(""),
    },
  },
};
