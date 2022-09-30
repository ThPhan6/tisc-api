import { DesignStatusKey, DesignStatusValue } from "@/types";

export const DESIGN_STATUSES: {
  ACTIVE: DesignStatusValue;
  INACTIVE: DesignStatusValue;
} = {
  ACTIVE: 1,
  INACTIVE: 2,
};
export const DESIGN_STATUS_OPTIONS: {
  key: DesignStatusKey;
  value: DesignStatusValue;
}[] = [
  {
    key: "Active",
    value: DESIGN_STATUSES.ACTIVE,
  },
  {
    key: "Inactive",
    value: DESIGN_STATUSES.INACTIVE,
  },
];
