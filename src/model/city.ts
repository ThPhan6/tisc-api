import Model from "./index";
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
export default class CityModel extends Model<ICityAttributes> {
  constructor() {
    super("cities");
  }
}
