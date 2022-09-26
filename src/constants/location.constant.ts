import {ICountryStateCity} from '@/types';

export const GLOBAL_COUNTRY_ID = '-1';

export const GlobalCountry: ICountryStateCity = {
  country_id: GLOBAL_COUNTRY_ID,
  country_name: "Global",
  state_id: "",
  state_name: "",
  city_id: "",
  city_name: "",
  phone_code: "",
}


export const getRegionName = (key: string) => {
  if (key === "africa") return "AFRICA";
  if (key === "asia") return "ASIA";
  if (key === "europe") return "EUROPE";
  if (key === "n_america") return "NORTH AMERICA";
  if (key === "oceania") return "OCEANIA";
  return "SOUTH AMERICA";
};
