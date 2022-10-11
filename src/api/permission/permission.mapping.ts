import {CompanyPermissionWithInfo, CompanyPermissionList} from '@/types';
import { ROLE_NAMES, ROLE_INDEX } from '@/constants';
import {sortBy} from 'lodash';

export const mappingPermission = (permissions: CompanyPermissionWithInfo[]) => {
  const perms: CompanyPermissionList[] = [];
  permissions.forEach((permission) => {
    /// get index of response
    const permIndex = perms.findIndex((item) => item.id === permission.permission_id);
    /// role permission
    const item = {
      accessable: permission.accessable,
      id: permission.id,
      name: ROLE_NAMES[permission.role_id],
      index: ROLE_INDEX[permission.role_id]
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
      perms[permIndex].items.push(item);
      perms[permIndex].items = sortBy(perms[permIndex].items, ['index']);
    }
  });

  /// mapping sub item
  const response = sortBy(perms, (o) => o.parent_id !== null).reduce((response, perm) => {
    perm.items = perm.items.map((item) => {
      return {
        accessable: item.accessable,
        id: item.id,
        name: item.name,
      }
    });

    if (!perm.parent_id) {
      response.push(perm);
      return response;
    }
    /// get index of response
    const index = response.findIndex((item) => item.id === perm.parent_id);
    if (index > -1) { // found
      response[index].subs.push(perm);
      response[index].subs = sortBy(response[index].subs, ['id']);
    }
    return response;
  }, [] as CompanyPermissionList[]);
  return sortBy(response, ['id']);
}
