import { Pagination, UserAttributes, UserStatus } from "@/types";

export type PartnerContactSort = "fullname" | "company_name" | "country_name";
export type PartnerContactFilter = {
  status?: UserStatus;
};
export interface PartnerContactAttributes extends UserAttributes {}

export interface PartnerContactRequest
  extends Pick<
    PartnerContactAttributes,
    | "id"
    | "firstname"
    | "lastname"
    | "linkedin"
    | "position"
    | "gender"
    | "email"
    | "phone"
    | "mobile"
    | "status"
    | "relation_id"
    | "remark"
  > {}

export interface PartnerContactResponse extends PartnerContactRequest {
  id: string;
}

export interface PartnerContactListResponse {
  data: {
    partner_contacts: PartnerContactResponse[];
    pagination: Pagination;
  };
  statusCode: number;
}
