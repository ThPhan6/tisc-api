import {ConnectionInterface} from '@/Database/Connections/ArangoConnection';
import statesJSON from '@@/database/geo_locations/states.json';

export const up = (connection: ConnectionInterface) => {
  return connection.collection('states').import(statesJSON);
}
