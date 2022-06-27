export const ROLES = {
  TISC_ADMIN: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
  TISC_CONSULTANT_TEAM: "248a21fc-42e0-48c6-9bc2-b95e11a81fb7",
  BRAND_ADMIN: "62ad5077-6183-435e-97f8-81c35065504e",
  BRAND_TEAM: "c93584c7-7987-4be0-aa7d-e48e20960630",
  DESIGN_ADMIN: "68fdf6d0-464e-404b-90e8-5d02a48ac498",
  DESIGN_TEAM: "1493b47a-1118-43e2-9bd8-1a3c3adc3f13",
};

export const TISC_ADMIN_USER_ID = "1110813b-8422-4e94-8d2a-8fdef644480e";
export const TISC_ADMIN_USER_PASSWORD =
  "$2a$09$Uk42d5scAMr8MkxbzTTsceXpsouiX4aKFXL4NHQ6b.HHBI23rpIgS";
export const TISC_ADMIN_USER_EMAIL = "liming@tisc.global";
export const TISC_ADMIN_USER_FULL_NAME = "admin";

export const USER_STATUSES = {
  ACTIVE: 1,
  BLOCKED: 0,
  PENDING: 2,
};

export const USER_STATUS_OPTIONS = [
  {
    key: "Activated",
    value: USER_STATUSES.ACTIVE,
  },
  {
    key: "Pending",
    value: USER_STATUSES.PENDING,
  },
  {
    key: "Blocked",
    value: USER_STATUSES.BLOCKED,
  },
];
