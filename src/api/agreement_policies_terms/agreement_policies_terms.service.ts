import moment from "moment";
import { MESSAGE } from "./../../constant/common.constant";
import { IMessageResponse } from "../../type/common.type";
import {
  IAgreementPoliciesTermsRequest,
  IAgreementPoliciesTermsResponse,
} from "./agreement_policies_terms.type";
import AgreementPoliciesTermsModel from "../../model/agreemen_policies_terms.model";
const uuid = require("uuid").v4;

class AgreementPoliciesTermsService {
  private agreementPoliciesTermsModel: AgreementPoliciesTermsModel;
  constructor() {
    this.agreementPoliciesTermsModel = new AgreementPoliciesTermsModel();
  }

  public create = (
    payload: IAgreementPoliciesTermsRequest,
    user_id: string
  ): Promise<IAgreementPoliciesTermsResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const updated_at = moment().toISOString();
      const result = await this.agreementPoliciesTermsModel.create({
        title: payload.title,
        document: payload.document,
        created_by: user_id,
        logo: null,
        type: null,
        updated_at,
      });
      if (!result) {
        return resolve({
          message: MESSAGE.FAILED_CREATE,
          statusCode: 400,
        });
      }
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
}

export default AgreementPoliciesTermsService;
