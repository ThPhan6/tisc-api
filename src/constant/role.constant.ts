import {ROLES} from './user.constant';

export const getRoleType = (role?: string) => {
  if (
    role === ROLES.TISC_ADMIN ||
    role === ROLES.TISC_CONSULTANT_TEAM
  ) {
    return 'tisc';
  }
  if (
    role === ROLES.BRAND_ADMIN ||
    role === ROLES.BRAND_TEAM
  ) {
    return 'brand';
  }
  if (
    role === ROLES.DESIGN_ADMIN ||
    role === ROLES.DESIGN_TEAM
  ) {
    return 'design';
  }
  return undefined;
}
