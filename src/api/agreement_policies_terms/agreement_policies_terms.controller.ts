import { IAgreementPoliciesTermsRequest } from "./agreement_policies_terms.type";
import { Request, ResponseToolkit } from "@hapi/hapi";
import AgreementPoliciesTermsService from "./agreement_policies_terms.service";
export default class AgreementPoliciesTermsController {
  private service: AgreementPoliciesTermsService;
  constructor() {
    this.service = new AgreementPoliciesTermsService();
  }
  public create = async (
    req: Request & { payload: IAgreementPoliciesTermsRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    // const userId = req.auth.credentials.user_id as string;
    const userId = "1110813b-8422-4e94-8d2a-8fdef644480e";
    const response = await this.service.create(payload, userId);
    console.log(response, "[response]");
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
