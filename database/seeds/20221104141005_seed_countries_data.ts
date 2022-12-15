import {ConnectionInterface} from '@/Database/Connections/ArangoConnection';
import countriesJSON from '@@/database/geo_locations/countries.json';

export const up = (connection: ConnectionInterface) => {
  return connection.collection('countries').import(countriesJSON);
}
