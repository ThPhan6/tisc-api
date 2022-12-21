export interface ILocationAttributes {
  id: string;
  business_name: string;
  business_number?: string;
  functional_type_ids: string[];
  functional_type: string;
  country_id: string;
  country_name: string;
  state_id: string | null;
  state_name: string | null;
  city_id: string;
  city_name: string;
  phone_code: string;
  address: string;
  postal_code: string;
  general_phone: string;
  general_email: string;
  created_at: string;
  updated_at: string | null;
  type: LocationType;
  relation_id: string | null;
}

export interface LocationWithTeamCountAndFunctionType extends ILocationAttributes {
  functional_types: {
    id: string;
    name: string;
  }[];
  teams: number;
}

export interface LocationPayload
  extends Omit<ILocationAttributes, "id" | "created_at" | "updated_at"> {}

export interface ICountryStateCity {
  country_id: string;
  state_id: any;
  city_id: string;
  country_name: string;
  state_name: string;
  city_name: string;
  phone_code: string;
}

export interface IStateAttributes {
  id: string;
  name: string;
  country_id: string;
  country_code: string;
  country_name: string;
  state_code: string;
  type: string;
  latitude: number;
  longitude: number;
}

export interface ICountryAttributes {
  id: string;
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: string;
  phone_code: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  tld: string;
  native: string;
  region: string;
  subregion: string;
  timezones: string;
  latitude: number;
  longitude: number;
  emoji: string;
  emojiU: string;
}
export interface ICityAttributes {
  id: string;
  name: string;
  state_id: string;
  state_code: string;
  state_name: string;
  country_id: string;
  country_code: string;
  country_name: string;
  latitude: number;
  longitude: number;
  wikiDataId: string;
}

export interface CountryGroupCount {
  country_name: string;
  count: number;
}

export interface IRegionCountry {
  id: string;
  name: string;
  phone_code: string;
  region: string;
}

export type RegionKey = 'asia' | 'europe' | 'africa' | 'n_americas' | 's_americas' | 'oceania';

export enum DesignFirmFunctionalType {
  MainOffice = '1',
  SatelliteOffice = '2',
  Other = '3'
}

export const DesignLocationFunctionTypeOption = [
  {
    name: "Main office",
    id: DesignFirmFunctionalType.MainOffice,
  },
  {
    name: "Satellite office",
    id: DesignFirmFunctionalType.SatelliteOffice,
  },
  {
    name: "Other",
    id: DesignFirmFunctionalType.Other,
  },
];


export interface LocationRequest {
  business_name: string;
  business_number?: string;
  functional_type_ids: string[];
  country_id: string;
  state_id: string;
  city_id: string;
  address: string;
  postal_code: string;
  general_phone: string;
  general_email: string;
}

export enum LocationType {
  tisc = 1,
  brand = 2,
  designer = 3,
}

export interface BasicLocationAttributes
  extends ICountryStateCity,
    Pick<ILocationAttributes, "address" | "postal_code"> {}
