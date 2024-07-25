import ElectricalGeoLocationModel, {
  ElectricalGeoLocationAttributes,
} from "@/models/electrical_geo_location.model";
import BaseRepository from "./base.repository";

class ElectricalGeoLocationRepository extends BaseRepository<ElectricalGeoLocationAttributes> {
  protected model: ElectricalGeoLocationModel;

  constructor() {
    super();
    this.model = new ElectricalGeoLocationModel();
  }
}

export default new ElectricalGeoLocationRepository();
export const electricalGeoLocationRepository =
  new ElectricalGeoLocationRepository();
