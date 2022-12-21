import { UserType, UserRole } from "@/types";
import {RoleType} from '@/constants';

export const validateRoleType = (role: UserType, roleId: UserRole) => {
  const roleType = RoleType[roleId];

  /// TISC ROLE
  if (role === UserType.TISC && roleType === UserType.TISC) {
    return true;
  }

  // BRAND ROLE
  if (role === UserType.Brand && roleType === UserType.Brand) {
    return true;
  }

  // DESIGN FIRM ROLE
  if (role === UserType.Designer && roleType === UserType.Designer) {
    return true;
  }

  return false;
};
