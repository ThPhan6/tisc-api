import {ConnectionInterface} from '@/Database/Connections/ArangoConnection';

export const up = async (connection: ConnectionInterface) => {
  const table = connection.collection('migrations');
  await table.create();
  await table.ensureIndex({
    fields: ['id'],
    unique: true,
  });
}
export const down = (connection: ConnectionInterface) => {
  return connection.collection('migrations').truncate();
}
