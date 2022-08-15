import Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";

// const customFilter = (value: any, helpers: any) => {
//   try {
//     const filter = JSON.parse(decodeURIComponent(value));
//     if (typeof filter === "object") {
//       return filter;
//     }
//     return helpers.error("any.invalid");
//   } catch (error) {
//     return helpers.error("any.invalid");
//   }
// };
export default {
  retrieve: {
      payload: {
        personal_email: Joi.string()
          .required()
          .error(commonFailValidatedMessageFunction("Personal Email is required")),
        mobile: Joi.string()
          .required()
          .error(commonFailValidatedMessageFunction("Mobile Number is required")),
        phone_code: Joi.string()
          .required()
          .error(commonFailValidatedMessageFunction("Mobile Country Code is required")),
      },
    },
  getProductList: {
      query: {
        brandId: Joi.string(),
        categoryId: Joi.string(),
      },
    },
};
