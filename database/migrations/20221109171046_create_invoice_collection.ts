import { ConnectionInterface } from "@/Database/Connections/ArangoConnection";

export const up = async (connection: ConnectionInterface) => {
  const table = connection.collection("invoices");
  await table.create();
  await table.ensureIndex({
    fields: ["id"],
    unique: true,
  });
  return true;
};

export const down = (connection: ConnectionInterface) => {
  return connection.collection("invoices").drop();
};
