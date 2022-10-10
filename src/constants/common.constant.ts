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
  name: FunctionalTypeKey;
  id: FunctionalTypeValue;
}[] = [
  {
    name: "Main office",
    id: FUNCTIONAL_TYPE.MAIN_OFFICE,
  },
  {
    name: "Satellite office",
    id: FUNCTIONAL_TYPE.SATELLITE_OFFICE,
  },
  {
    name: "Other",
    id: FUNCTIONAL_TYPE.OTHER,
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
  name: MeasurementUnitKey;
  id: MeasurementUnitValue;
}[] = [
  {
    name: "Metric",
    id: MEASUREMENT_UNIT.METRIC,
  },
  {
    name: "Imperial",
    id: MEASUREMENT_UNIT.IMPERIAL,
  },
];
