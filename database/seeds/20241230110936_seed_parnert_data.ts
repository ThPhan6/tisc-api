import { ConnectionInterface } from "@/Database/Connections/ArangoConnection";
import { PartnerRoles, RoleNames } from "@/constants";
import moment from "moment";
import { map, pick } from "lodash";

export const up = (connection: ConnectionInterface) => {
  const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");

  const roleData = map(
    pick(RoleNames, `${PartnerRoles.Admin}`),
    (name, roleId) => {
      return {
        id: roleId,
        name: name,
        created_at: currentTime,
        updated_at: currentTime,
        deleted_at: null,
      };
    }
  );

  return connection.insert("roles", roleData);
};
