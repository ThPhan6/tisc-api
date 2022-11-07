import {ConnectionInterface} from '@/Database/Connections/ArangoConnection';
import citiesJSON from '@@/database/geo_locations/cities.json';

export const up = (connection: ConnectionInterface) => {
  return connection.collection('cities').import(citiesJSON as any);
}
