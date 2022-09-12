import {RoleType} from '@/types';
export const ROLES = {
  TISC_ADMIN: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
  TISC_CONSULTANT_TEAM: "248a21fc-42e0-48c6-9bc2-b95e11a81fb7",
  BRAND_ADMIN: "62ad5077-6183-435e-97f8-81c35065504e",
  BRAND_TEAM: "c93584c7-7987-4be0-aa7d-e48e20960630",
  DESIGN_ADMIN: "68fdf6d0-464e-404b-90e8-5d02a48ac498",
  DESIGN_TEAM: "1493b47a-1118-43e2-9bd8-1a3c3adc3f13",
};

export const ROLE_TYPE: RoleType = {
  TISC: 1,
  BRAND: 2,
  DESIGN: 3,
};

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
