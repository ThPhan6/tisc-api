import { ConnectionInterface } from "@/Database/Connections/ArangoConnection";
import { v4 as uuid } from "uuid";
import moment from "moment";

const records = [
  { type: 15, name: "Offline Marketing & Sales" },
  { type: 15, name: "Online Marketing & Sales" },
  { type: 15, name: "Product Card Conversion" },
];

export const up = (connection: ConnectionInterface) => {
  const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
  return connection.insert(
    "common_types",
    records.map((item) => ({
      id: uuid(),
      type: item.type,
      name: item.name,
      created_at: currentTime,
      updated_at: currentTime,
      deleted_at: null,
      relation_id: null,
    }))
  );
};
