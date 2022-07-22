import Model from "./index";
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
export default class StateModel extends Model<IStateAttributes> {
  constructor() {
    super("states");
  }
}
