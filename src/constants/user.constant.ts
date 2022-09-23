import { ISystemType } from "@/types";
export const TISC_ADMIN_USER_ID = "1110813b-8422-4e94-8d2a-8fdef644480e";
export const TISC_ADMIN_USER_PASSWORD =
  "$2a$09$Uk42d5scAMr8MkxbzTTsceXpsouiX4aKFXL4NHQ6b.HHBI23rpIgS";
export const TISC_ADMIN_USER_EMAIL = "liming@tisc.global";
export const TISC_ADMIN_USER_FULL_NAME = "admin";

export const USER_STATUSES = {
  ACTIVE: 1,
  BLOCKED: 2,
  PENDING: 3,
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

export const SYSTEM_TYPE: ISystemType = {
  TISC: 1,
  BRAND: 2,
  DESIGN: 3,
};
