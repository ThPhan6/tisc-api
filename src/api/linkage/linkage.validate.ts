import { errorMessage } from "@/validates/common.validate";
import Joi from "joi";

export default {
  upsertLinkages: {
    payload: {
      data: Joi.array()
        .items(
          Joi.object({
            pair: Joi.string(),
            is_pair: Joi.boolean(),
          })
        )
        .required()
        .error(errorMessage("Linkage is required")),
    },
  },
  pair: {
    payload: {
      pair: Joi.string(),
      is_pair: Joi.boolean(),
    },
  },
  getLinkage: {
    params: {
      option_id: Joi.string(),
    },
  },
};
