import { requireStringValidation } from "@/validates/common.validate";

const quotationPayload = {
  author: requireStringValidation("Author"),
  identity: requireStringValidation("Identity"),
  quotation: requireStringValidation("Quote"),
};

export default {
  create: {
    payload: quotationPayload,
  },
  update: {
    params: {
      id: requireStringValidation("Quote id"),
    },
    payload: quotationPayload,
  },
};
