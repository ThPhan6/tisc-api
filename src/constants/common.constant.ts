import {
  CommonTypes,
  FunctionalTypeKey,
  FunctionalTypeValue,
  MeasurementUnitKey,
  MeasurementUnitValue,
} from "@/types";

export const COMMON_TYPES: CommonTypes = {
  SHARING_GROUP: 1,
  SHARING_PURPOSE: 2,
  PROJECT_BUILDING: 3,
  FINISH_SCHEDULES: 4,
  COMPANY_FUNCTIONAL: 5,
  PROJECT_INSTRUCTION: 6,
  PROJECT_TYPE: 7,
  PROJECT_REQUIREMENT: 8,
  PROJECT_UNIT: 9,
  DEPARTMENT: 10,
};

export const AUTH_NAMES = {
  GENERAL: "general",
  ADMIN: "admin",
  PERMISSION: "permission",
};

export const FUNCTIONAL_TYPE: {
  MAIN_OFFICE: FunctionalTypeValue;
  SATELLITE_OFFICE: FunctionalTypeValue;
  OTHER: FunctionalTypeValue;
} = {
  MAIN_OFFICE: 1,
  SATELLITE_OFFICE: 2,
  OTHER: 3,
};
export const FUNCTIONAL_TYPE_OPTIONS: {
  key: FunctionalTypeKey;
  value: FunctionalTypeValue;
}[] = [
  {
    key: "Main office",
    value: FUNCTIONAL_TYPE.MAIN_OFFICE,
  },
  {
    key: "Satellite office",
    value: FUNCTIONAL_TYPE.SATELLITE_OFFICE,
  },
  {
    key: "Other",
    value: FUNCTIONAL_TYPE.OTHER,
  },
];

export const MEASUREMENT_UNIT: {
  IMPERIAL: MeasurementUnitValue;
  METRIC: MeasurementUnitValue;
} = {
  IMPERIAL: 1,
  METRIC: 2,
};
export const MEASUREMENT_UNIT_OPTIONS: {
  key: MeasurementUnitKey;
  value: MeasurementUnitValue;
}[] = [
  {
    key: "Metric",
    value: MEASUREMENT_UNIT.METRIC,
  },
  {
    key: "Imperial",
    value: MEASUREMENT_UNIT.IMPERIAL,
  },
];
