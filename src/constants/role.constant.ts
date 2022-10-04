import {RoleType} from '@/types';
import {includes} from 'lodash';

export const TISC_ROLES = {
  TISC_ADMIN: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
  // TISC_TEAM: "tisc_team",
  TISC_CONSULTANT_TEAM: "248a21fc-42e0-48c6-9bc2-b95e11a81fb7",
}

export const BRAND_ROLES = {
  BRAND_ADMIN: "62ad5077-6183-435e-97f8-81c35065504e",
  // BRAND_LEAD: "brand_lead",
  BRAND_TEAM: "c93584c7-7987-4be0-aa7d-e48e20960630",
}

export const DESIGN_FIRM_ROLES = {
  DESIGN_ADMIN: "68fdf6d0-464e-404b-90e8-5d02a48ac498",
  // DESIGN_LEAD: "design_lead",
  DESIGN_TEAM: "1493b47a-1118-43e2-9bd8-1a3c3adc3f13",
}

export const ROLES = {
    ...TISC_ROLES,
    ...BRAND_ROLES,
    ...DESIGN_FIRM_ROLES,
};

export const ROLE_NAMES = {

  [ROLES.TISC_ADMIN]: 'TISC Admin',
  // [ROLES.TISC_TEAM]: 'TISC Team',
  [ROLES.TISC_CONSULTANT_TEAM]: 'Consultant Team',

  [ROLES.BRAND_ADMIN]: 'Brand Admin',
  // [ROLES.BRAND_LEAD]: 'Brand Admin',
  [ROLES.BRAND_TEAM]: 'Brand Team',

  [ROLES.DESIGN_ADMIN]: 'Design Admin',
  // [ROLES.DESIGN_LEAD]: 'Design Admin',
  [ROLES.DESIGN_TEAM]: 'Design Team',
}

export const ROLE_INDEX = {
  [ROLES.TISC_ADMIN]: 1,
  // [ROLES.TISC_TEAM]: 2,
  [ROLES.TISC_CONSULTANT_TEAM]: 3,

  [ROLES.BRAND_ADMIN]: 4,
  // [ROLES.BRAND_LEAD]: 5,
  [ROLES.BRAND_TEAM]: 6,

  [ROLES.DESIGN_ADMIN]: 7,
  // [ROLES.DESIGN_LEAD]: 8,
  [ROLES.DESIGN_TEAM]: 9,
}

export const ROLE_TYPE: RoleType = {
  TISC: 1,
  BRAND: 2,
  DESIGN: 3,
};



export const getRoleType = (role: string) => {

  if (includes(TISC_ROLES, role)) {
    return 'tisc';
  }

  if (includes(BRAND_ROLES, role)) {
    return 'brand';
  }

  if (includes(DESIGN_FIRM_ROLES, role)) {
    return 'design';
  }

  return undefined;
}
