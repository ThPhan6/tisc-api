import {
  requireStringValidation,
  requireNumberValidation,
  stringValidation,
  numberValidation,
  getListValidation,
} from "@/validate/common.validate";

export default {
  create: {
    payload: {
      service_type_id: requireStringValidation("Service type id"),
      brand_id: requireStringValidation("Brand id"),
      ordered_by: requireStringValidation("Ordered by"),
      unit_rate: requireNumberValidation("Unit rate"),
      quantity: requireNumberValidation("Quantity"),
      tax: requireNumberValidation("Tax"),
      remark: requireStringValidation("Remark"),
    },
  },
  update: {
    params: {
      id: requireStringValidation("Id"),
    },
    payload: {
      service_type_id: stringValidation(),
      brand_id: stringValidation(),
      ordered_by: stringValidation(),
      unit_rate: numberValidation(),
      quantity: numberValidation(),
      tax: numberValidation(),
      remark: stringValidation(),
    },
  },
  get: {
    params: {
      id: requireStringValidation("Id"),
    },
  },
  getList: getListValidation(),
};
