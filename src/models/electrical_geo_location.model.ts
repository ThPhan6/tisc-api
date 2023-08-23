import Model from "@/Database/Model";

export interface ElectricalGeoLocationAttributes {
  id: string;
  country_name: string;
  country_code: string;
  country_calling_code: string;
  currency_name: string;
  currency_code: string;
  plug_type: string;
  voltage: string;
  frequency: string;
}

export default class ElectricalGeoLocationModel extends Model<ElectricalGeoLocationAttributes> {
  protected table = "electrical_geo_locations";
  protected softDelete = true;
}
