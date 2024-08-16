export interface PartnerAttributes {
  id: string;
  name: string;
  country_id: string;
  city_id: string;
  contact: string | null;
  affiliation: string;
  relation: boolean;
  acquisition: PartnerAcquisition;
  price_rate: number;
  authorized_country_name: string;
  authorized_country_ids: string[];
  coverage_beyond: boolean;
  state_id: string;
  address: string;
  postal_code: string;
  location_id: string;
  website: string;
  phone: string;
  email: string;
  remark: string;
}

export enum PartnerAcquisition {
  Active = 1,
  Leads = 2,
  Inactive = 3,
  Freeze = 4,
  Interested = 5,
}
