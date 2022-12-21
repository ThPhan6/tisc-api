import { ActiveStatus, ActiveStatusKey, ActiveStatusValue } from "@/types";

export const BRAND_STATUSES: {
  ACTIVE: ActiveStatus;
  INACTIVE: ActiveStatus;
  PENDING: ActiveStatus;
} = {
  ACTIVE: ActiveStatus.Active,
  INACTIVE: ActiveStatus.Inactive,
  PENDING: ActiveStatus.Pending,
};

export const BRAND_STATUS_OPTIONS: {
  key: ActiveStatusKey;
  value: ActiveStatusValue;
}[] = [
  {
    key: "Active",
    value: ActiveStatus.Active,
  },
  {
    key: "Pending",
    value: ActiveStatus.Pending,
  },
  {
    key: "Inactive",
    value: ActiveStatus.Inactive,
  },
];
