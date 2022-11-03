import {
  getListValidation,
  requireStringValidation,
} from "@/validate/common.validate";

export default {
  create: {
    payload: {
      name: requireStringValidation("Collection name"),
      brand_id: requireStringValidation("Brand"),
    },
  },
  getList: getListValidation({
    query: {
      brand_id: requireStringValidation("Brand"),
    },
  }),
};
