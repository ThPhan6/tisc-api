import { ActiveStatus, ActiveStatusKey, ActiveStatusValue } from "@/types";

export const DESIGN_STATUSES: {
  ACTIVE: ActiveStatusValue;
  INACTIVE: ActiveStatusValue;
} = {
  ACTIVE: 1,
  INACTIVE: 2,
};

export const DESIGN_STATUS_OPTIONS: {
  key: ActiveStatusKey;
  value: ActiveStatusValue;
}[] = [
  {
    key: "Active",
    value: ActiveStatus.Active,
  },
  {
    key: "Inactive",
    value: ActiveStatus.Inactive,
  },
];
