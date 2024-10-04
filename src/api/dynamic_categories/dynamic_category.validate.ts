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
  moveTo: {
    params: {
      category_id: requireStringValidation("Category"),
      sub_category_id: requireStringValidation("Sub Category"),
    },
  },
};
