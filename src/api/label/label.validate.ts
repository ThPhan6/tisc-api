import {
  getOneValidation,
  requireStringValidation,
} from "@/validates/common.validate";
import Joi from "joi";

export default {
  create: {
    payload: {
      name: requireStringValidation("Label").custom((value: string) =>
        value.toLowerCase()
      ),
      brand_id: requireStringValidation("Brand"),
      parent_id: Joi.any(),
    },
  },
  update: {
    ...getOneValidation,
    payload: {
      name: requireStringValidation("Label").custom((value: string) =>
        value.toLowerCase()
      ),
    },
  },
};
