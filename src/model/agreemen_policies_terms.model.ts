import { MODEL_NAMES } from "../constant/common.constant";
import { IAgreementPoliciesTermsAttribute } from "./../api/agreement_policies_terms/agreement_policies_terms.type";
import Model from "./index";

export default class AgreementPoliciesTermsModel extends Model<IAgreementPoliciesTermsAttribute> {
  constructor() {
    super(MODEL_NAMES.DOCUMENTTATIONS);
  }
}
