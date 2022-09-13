import {BrandStatus} from '@/types';
export const BRAND_STATUSES: BrandStatus = {
  ACTIVE: 1,
  INACTIVE: 2,
  PENDING: 3,
};

export const BRAND_STATUS_OPTIONS = [
  {
    key: "Active",
    value: BRAND_STATUSES.ACTIVE,
  },
  {
    key: "Pending",
    value: BRAND_STATUSES.PENDING,
  },
  {
    key: "Inactive",
    value: BRAND_STATUSES.INACTIVE,
  },
];
