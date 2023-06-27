import Joi from "joi";
import {
  getListValidation,
  requireStringValidation,
  errorMessage,
  getOneValidation,
} from "@/validates/common.validate";
import { getEnumValues } from "@/helpers/common.helper";
import { CollectionRelationType } from "@/types";

export default {
  create: {
    payload: {
      name: requireStringValidation("Collection name"),
      relation_id: requireStringValidation("Relation"),
      relation_type: Joi.number()
        .required()
        .valid(...getEnumValues(CollectionRelationType))
        .error(errorMessage("Relation Type is required")),
    },
  },
  update: {
    ...getOneValidation,
    payload: {
      name: requireStringValidation("Collection name"),
    },
  },
  getList: getListValidation({
    query: {
      relation_id: requireStringValidation("Relation"),
      relation_type: Joi.number()
        .required()
        .valid(...getEnumValues(CollectionRelationType))
        .error(errorMessage("Relation Type is required")),
      category_ids: Joi.string()
    },
  }),
};
