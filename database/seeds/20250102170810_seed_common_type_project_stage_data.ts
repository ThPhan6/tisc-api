import { ConnectionInterface } from "@/Database/Connections/ArangoConnection";
import { v4 as uuid } from "uuid";
import moment from "moment";
import { COMMON_TYPES } from "@/constants";

const records = [
  { type: COMMON_TYPES.PROJECT_STAGE, name: "keep-in-view" },
  { type: COMMON_TYPES.PROJECT_STAGE, name: "proposing-stage" },
  { type: COMMON_TYPES.PROJECT_STAGE, name: "tendering-stage" },
  { type: COMMON_TYPES.PROJECT_STAGE, name: "production-stage" },
  { type: COMMON_TYPES.PROJECT_STAGE, name: "completed" },
  { type: COMMON_TYPES.PROJECT_STAGE, name: "terminated" },
  { type: COMMON_TYPES.PROJECT_STAGE, name: "unawarded" },
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
