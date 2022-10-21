import { UserType } from "@/types";
import { getRoleType } from "@/constants";

export const validateRoleType = (role: UserType, roleId: string) => {
  const roleType = getRoleType(roleId);

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
