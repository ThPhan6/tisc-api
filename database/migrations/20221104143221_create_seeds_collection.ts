import {ConnectionInterface} from '@/Database/Connections/ArangoConnection';

export const up = async (connection: ConnectionInterface) => {
  const table = connection.collection('seeds');
  await table.create();
  await table.ensureIndex({
    fields: ['id'],
    unique: true,
  });
}
