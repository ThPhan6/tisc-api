import {UserType} from '@/types';
import {getEnumValues} from '@/helper/common.helper';

export enum TiscRoles {
  Admin = "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
  Consultant = "248a21fc-42e0-48c6-9bc2-b95e11a81fb7",
}

export enum BrandRoles {
  Admin = "62ad5077-6183-435e-97f8-81c35065504e",
  Member = "c93584c7-7987-4be0-aa7d-e48e20960630"
}

export enum DesignFirmRoles {
  Admin = "68fdf6d0-464e-404b-90e8-5d02a48ac498",
  Member = "1493b47a-1118-43e2-9bd8-1a3c3adc3f13"
}

export const RoleType = {
  [TiscRoles.Admin]: UserType.TISC,
  [TiscRoles.Consultant]: UserType.TISC,
  [BrandRoles.Admin]: UserType.Brand,
  [BrandRoles.Member]: UserType.Brand,
  [DesignFirmRoles.Admin]: UserType.Designer,
  [DesignFirmRoles.Member]: UserType.Designer,
}
export const RoleData = {
  [UserType.TISC]: getEnumValues(TiscRoles),
  [UserType.Brand]: getEnumValues(BrandRoles),
  [UserType.Designer]: getEnumValues(DesignFirmRoles),
}

export const RoleNames = {
  [TiscRoles.Admin]: "TISC Admin",
  [TiscRoles.Consultant]: "Consultant Team",

  [BrandRoles.Admin]: "Brand Admin",
  [BrandRoles.Member]: "Brand Team",

  [DesignFirmRoles.Admin]: "Design Admin",
  [DesignFirmRoles.Member]: "Design Team",
}

export const RoleIndex = {
  [TiscRoles.Admin]: 1,
  [TiscRoles.Consultant]: 2,

  [BrandRoles.Admin]: 3,
  [BrandRoles.Member]: 4,

  [DesignFirmRoles.Admin]: 5,
  [DesignFirmRoles.Member]: 6,
};

export const DefaultPermission = {
  tisc_consultant_team: [
    "permission_0",
    "permission_3_1",
    "permission_3_2",
    "permission_3_3"
  ],
  brand_team: [
    "permission_5",
    "permission_6",
    "permission_7"
  ],
  design_team: [
    "permission_10",
    "permission_11",
    "permission_12",
    "permission_13_2",
    "permission_13_3",
    "permission_13_4"
  ]
}
