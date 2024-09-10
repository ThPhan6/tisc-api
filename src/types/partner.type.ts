export interface PartnerAttributes {
  id: string;
  name: string;
  brand_id: string;
  country_id: string;
  city_id: string;
  contact: string | null;
  affiliation_name: string;
  affiliation_id: string;
  relation_name: string;
  relation_id: string;
  acquisition_name: string;
  acquisition_id: string;
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
