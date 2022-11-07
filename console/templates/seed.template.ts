import {ConnectionInterface} from '@/Database/Connections/ArangoConnection';

export const up = (connection: ConnectionInterface) => {
  return connection.insert(
    '<%= collection %>', {} /// can be [{}]
  );
}
