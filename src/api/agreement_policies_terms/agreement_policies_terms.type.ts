export interface IAgreementPoliciesTermsAttribute {
  id: string;
  logo?: string | null;
  type?: number | null;
  title: string;
  document: string;
  created_at?: any;
  created_by: string; //author
  updated_at?: any;
}

export interface IAgreementPoliciesTermsRequest {
  title: string;
  document: string;
}

export interface IAgreementPoliciesTermsResponse {
  data: IAgreementPoliciesTermsAttribute;
  statusCode: number;
}
