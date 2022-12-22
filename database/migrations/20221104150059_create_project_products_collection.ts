import {ConnectionInterface} from '@/Database/Connections/ArangoConnection';

export const up = async (connection: ConnectionInterface) => {
  const table = connection.collection('project_products');
  await table.create();
  await table.ensureIndex({
    fields: ['id'],
    unique: true,
  });
}

export const down = (connection: ConnectionInterface) => {
  return connection.collection('project_products').drop();
}
