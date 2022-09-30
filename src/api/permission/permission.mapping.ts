import {CompanyPermissionWithInfo, CompanyPermissionList} from '@/types';
import { ROLE_NAMES } from '@/constants';

export const mappingPermission = (permissions: CompanyPermissionWithInfo[]) => {
  const perms: CompanyPermissionList[] = [];
  permissions.forEach((permission) => {
    /// get index of response
    const permIndex = perms.findIndex((item) => item.id === permission.permission_id);
    /// role permission
    const item = {
      accessable: permission.accessable,
      id: permission.id,
      name: ROLE_NAMES[permission.role_id]
    };
    ///
    if (permIndex === -1) { // not found
      perms.push({
        id: permission.permission_id,
        logo: permission.logo,
        name: permission.name,
        parent_id: permission.parent_id,
        items: [item],
        subs: [],
      });
    } else { /// found
      perms[permIndex].items.push(item)
    }
  });
  /// mapping sub item
  return perms.reduce((response, perm) => {
    if (!perm.parent_id) {
      response.push(perm);
      return response;
    }
    /// get index of response
    const index = response.findIndex((item) => item.id === perm.parent_id);
    if (index > -1) { // not found
      response[index].subs.push(perm);
    }
    return response;
  }, [] as CompanyPermissionList[]);
}
