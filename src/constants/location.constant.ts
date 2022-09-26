import { ICountryStateCity, RegionKey } from "@/types";

export const GLOBAL_COUNTRY_ID = "-1";

export const GlobalCountry: ICountryStateCity = {
  country_id: GLOBAL_COUNTRY_ID,
  country_name: "Global",
  state_id: "",
  state_name: "",
  city_id: "",
  city_name: "",
  phone_code: "",
};

export const REGION_KEY: {
  AFRICA: RegionKey;
  ASIA: RegionKey;
  EUROPE: RegionKey;
  NORTH_AMERICA: RegionKey;
  OCEANIA: RegionKey;
  SOUTH_AMERICA: RegionKey;
  AMERICAS: RegionKey;
  NORTHERN_AMERICA: RegionKey;
} = {
  AFRICA: "africa",
  ASIA: "asia",
  EUROPE: "europe",
  NORTH_AMERICA: "north america",
  OCEANIA: "oceania",
  SOUTH_AMERICA: "south america",
  AMERICAS: "americas",
  NORTHERN_AMERICA: "northern_america",
};
