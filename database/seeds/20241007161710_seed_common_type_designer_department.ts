import { ConnectionInterface } from "@/Database/Connections/ArangoConnection";
import { v4 as uuid } from "uuid";
import moment from "moment";
import { COMMON_TYPES } from "@/constants";

const records = [
  { type: COMMON_TYPES.DESIGNER_DEPARTMENT, name: "Administrative" },
  { type: COMMON_TYPES.DESIGNER_DEPARTMENT, name: "Business Development & Client Relation" },
  { type: COMMON_TYPES.DESIGNER_DEPARTMENT, name: "Creative & Design" },
  { type: COMMON_TYPES.DESIGNER_DEPARTMENT, name: "Leadership & Management" },
  { type: COMMON_TYPES.DESIGNER_DEPARTMENT, name: "Operation & Production" },
  { type: COMMON_TYPES.DESIGNER_DEPARTMENT, name: "Project Management" },
  { type: COMMON_TYPES.DESIGNER_DEPARTMENT, name: "Quality Assurance" },
  { type: COMMON_TYPES.DESIGNER_DEPARTMENT, name: "Research & Development" },
  { type: COMMON_TYPES.DESIGNER_DEPARTMENT, name: "Technical & Support" },
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
