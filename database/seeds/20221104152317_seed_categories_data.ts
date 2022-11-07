import {ConnectionInterface} from '@/Database/Connections/ArangoConnection';

export const up = (connection: ConnectionInterface) => {
  return connection.insert(
    'categories', {} /// can be [{}]
  );
}
