import * as Hapi from "@hapi/hapi";
import agreementPoliciesTermsController from "./agreement_policies_terms.controller";
import validate from "./agreement_policies_terms.validate";
import IRoute from "../../helper/route.helper";
import {
  defaultRouteOptionResponseStatus,
  generalMessageResponse,
} from "../../helper/response.helper";
import agreementPoliciesTermsResponse from "./agreement_policies_terms.response";
import { ROUTE } from "../../constant/route.constant";
import commonValidate from "../../validate/common.validate";
export default class AgreementPoliciesTermsRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new agreementPoliciesTermsController();

      server.route([
        {
          method: ROUTE.AGREEMENT_POLICIES_TERMS.CREATE.METHOD,
          path: ROUTE.AGREEMENT_POLICIES_TERMS.CREATE.PATH,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create agreement policies terms",
            tags: ["api", "agreement policies terms"],
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: agreementPoliciesTermsResponse.AgreementPoliciesTerms,
              },
            },
          },
        },
        {
          method: ROUTE.AGREEMENT_POLICIES_TERMS.GET_LIST.METHOD,
          path: ROUTE.AGREEMENT_POLICIES_TERMS.GET_LIST.PATH,
          options: {
            handler: controller.getList,
            // validate: commonValidate.getList,
            description: "Method that get list agreement policies terms",
            tags: ["api", "agreement policies terms"],
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: agreementPoliciesTermsResponse.ListAgreementPoliciesTerms,
              },
            },
          },
        },
      ]);
      resolve(true);
    });
  }
}
