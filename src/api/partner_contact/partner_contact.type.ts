import { Pagination } from "@/types";
import { PartnerAttributes } from "@/types/partner.type";

export enum PartnerContactStatus {
  Uninitiate,
  Pending,
  Activated,
}
export type PartnerContactSort = "fullname" | "company_name" | "country_name";
export type PartnerContactFilter = {
  status?: PartnerContactStatus;
};
export interface PartnerContactAttributes {
  id: string;
  partner_company_id: string;
  firstname: string;
  lastname: string;
  gender: boolean;
  linkedin: string;
  position: string;
  email: string;
  phone: string;
  mobile: string;
  remark: string;
  status: PartnerContactStatus;
}
export type PartnerContactRequest = Omit<PartnerAttributes, "id" | "status">;

export interface PartnerContactResponse {
  data: {
    partner_contacts: {
      fullname: string;
      company: string;
      country: string;
      position: string;
      email: string;
      phone: string;
      mobile: string;
      activation: number;
    }[];
    pagination: Pagination;
  };
  statusCode: number;
}
