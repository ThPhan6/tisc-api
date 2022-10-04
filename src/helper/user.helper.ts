import {RoleTypeValue} from '@/types';
import {ROLE_TYPE, getRoleType} from '@/constants';

export const validateRoleType = (role: RoleTypeValue, roleId: string) => {

  const roleType = getRoleType(roleId);

  /// TISC ROLE
  if (role === ROLE_TYPE.TISC && roleType === 'tisc') {
    return true;
  }

  // BRAND ROLE
  if (role === ROLE_TYPE.BRAND && roleType === 'brand') {
    return true;
  }

  // DESIGN FIRM ROLE
  if (role === ROLE_TYPE.DESIGN && roleType === 'design') {
    return true;
  }

  return false;
}
