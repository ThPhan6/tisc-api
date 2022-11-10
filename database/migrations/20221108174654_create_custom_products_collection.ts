import { ConnectionInterface } from "@/Database/Connections/ArangoConnection";

export const up = async (connection: ConnectionInterface) => {
  const table = connection.collection("custom_products");
  await table.create();
  await table.ensureIndex({
    fields: ["id"],
    unique: true,
    // type: "hash"
    // sparse: true,
  });
  return true;
};

export const down = (connection: ConnectionInterface) => {
  return connection.collection("custom_products").drop();
};
