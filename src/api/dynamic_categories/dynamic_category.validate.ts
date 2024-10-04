import {
  getOneValidation,
  requireStringValidation,
} from "@/validates/common.validate";
import Joi from "joi";

export default {
  create: {
    payload: {
      name: requireStringValidation("Category").custom((value: string) =>
        value.toLowerCase()
      ),
      parent_id: Joi.any(),
      level: Joi.any(),
      type: Joi.any(),
    },
  },
  update: {
    ...getOneValidation,
    payload: {
      name: requireStringValidation("Category").custom((value: string) =>
        value.toLowerCase()
      ),
    },
  },
  move: {
    params: {
      sub_id: requireStringValidation("Category"),
    },
    payload: {
      parent_id: Joi.string(),
    },
  },
};
