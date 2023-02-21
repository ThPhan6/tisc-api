import {
  requireStringValidation,
  requireNumberValidation,
  stringValidation,
  numberValidation,
  getListValidation,
} from "@/validates/common.validate";
import Joi from "joi";

const invoiceValidate = {
  service_type_id: requireStringValidation("Service type"),
  brand_id: requireStringValidation("Brand"),
  ordered_by: requireStringValidation("Ordered by"),
  unit_rate: requireNumberValidation("Unit rate").greater(0).precision(2),
  quantity: requireNumberValidation("Quantity").greater(0),
  tax: numberValidation().label("Tax"),
  remark: stringValidation(),
};

export default {
  create: {
    payload: invoiceValidate,
  },
  update: {
    params: {
      id: requireStringValidation("Id"),
    },
    payload: invoiceValidate,
  },
  get: {
    params: {
      id: requireStringValidation("Id"),
    },
  },
  getList: getListValidation({
    query: {
      sort: Joi.string().valid(
        // GetListInvoiceSorting
        "created_at",
        "service_type_name",
        "brand_name",
        "ordered_by"
      ),
    },
  }),
};
