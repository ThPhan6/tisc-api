import { CompanyPermissionWithInfo, CompanyPermissionList } from "@/types";
import { RoleNames, RoleIndex } from "@/constants";
import { sortBy } from "lodash";

export const mappingPermission = (
  comPermissions: CompanyPermissionWithInfo[]
) => {
  const permissions: CompanyPermissionList[] = [];
  comPermissions.forEach((permission) => {
    /// get index of response
    const perIndex = permissions.findIndex(
      (el) => el.id === permission.permission_id
    );
    /// role permission
    const item = {
      accessable: permission.accessable,
      id: permission.id,
      name: RoleNames[permission.role_id],
      index: RoleIndex[permission.role_id],
    };
    ///
    if (perIndex === -1) {
      // not found
      permissions.push({
        id: permission.permission_id,
        logo: permission.logo,
        name: permission.name,
        parent_id: permission.parent_id,
        items: [item],
        subs: [],
      });
    } else {
      /// found
      permissions[perIndex].items.push(item);
      permissions[perIndex].items = sortBy(permissions[perIndex].items, [
        "index",
      ]);
    }
  });

  /// mapping sub item
  const response = permissions.reduce(
    (res, pm) => {
      pm.items = pm.items.map((item) => {
        return {
          accessable: item.accessable,
          id: item.id,
          name: item.name,
        };
      });

      if (!pm.parent_id) {
        res.push(pm);
        return res;
      }
      /// get index of response
      const index = res.findIndex((item) => item.id === pm.parent_id);
      if (index > -1) {
        // found
        res[index].subs.push(pm);
        res[index].subs = sortBy(res[index].subs, ["index"]);
      }
      return res;
    },
    [] as CompanyPermissionList[]
  );
  return sortBy(response, ["index"]);
};
