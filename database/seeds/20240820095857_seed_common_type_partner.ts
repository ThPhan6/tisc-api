import { ConnectionInterface } from "@/Database/Connections/ArangoConnection";
import { v4 as uuid } from "uuid";
import moment from "moment";
import { COMMON_TYPES } from "@/constants";

const records = [
  { type: COMMON_TYPES.PARTNER_AFFILIATION, name: "Agent" },
  { type: COMMON_TYPES.PARTNER_AFFILIATION, name: "Distributor" },
  { type: COMMON_TYPES.PARTNER_RELATION, name: "Direct" },
  { type: COMMON_TYPES.PARTNER_RELATION, name: "Indirect" },
  { type: COMMON_TYPES.PARTNER_ACQUISITION, name: "Leads" },
  { type: COMMON_TYPES.PARTNER_ACQUISITION, name: "Awareness" },
  { type: COMMON_TYPES.PARTNER_ACQUISITION, name: "Interests" },
  { type: COMMON_TYPES.PARTNER_ACQUISITION, name: "Negotiation" },
  { type: COMMON_TYPES.PARTNER_ACQUISITION, name: "Active" },
  { type: COMMON_TYPES.PARTNER_ACQUISITION, name: "Freeze" },
  { type: COMMON_TYPES.PARTNER_ACQUISITION, name: "Inactive" },
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
