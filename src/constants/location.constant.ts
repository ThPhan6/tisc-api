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

export const getRegionName = (key: string) => {
  if (key === REGION_KEY.AFRICA) return "AFRICA";
  if (key === "asia") return "ASIA";
  if (key === "europe") return "EUROPE";
  if (key === "n_america") return "NORTH AMERICA";
  if (key === "oceania") return "OCEANIA";
  return "SOUTH AMERICA";
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
