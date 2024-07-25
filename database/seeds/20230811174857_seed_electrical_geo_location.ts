import { ELECTRICAL_GEO_LOCATION } from "@/constants/electrical_geo_location.constant";
import { ConnectionInterface } from "@/Database/Connections/ArangoConnection";

export const up = (connection: ConnectionInterface) => {
  return connection.insert(
    "electrical_geo_locations",
    ELECTRICAL_GEO_LOCATION /// can be [{}]
  );
};
