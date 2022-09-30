import {
  MeasurementUnitKey,
  MeasurementUnitValue,
  ProjectStatusKey,
  ProjectStatusValue,
} from "@/types";

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

export const PROJECT_STATUS: {
  ARCHIVE: ProjectStatusValue;
  LIVE: ProjectStatusValue;
  ON_HOLD: ProjectStatusValue;
} = {
  ARCHIVE: 1,
  LIVE: 2,
  ON_HOLD: 3,
};
export const PROJECT_STATUS_OPTIONS: {
  key: ProjectStatusKey;
  value: ProjectStatusValue;
}[] = [
  {
    key: "Live",
    value: PROJECT_STATUS.LIVE,
  },
  {
    key: "On Hold",
    value: PROJECT_STATUS.ON_HOLD,
  },
  {
    key: "Archive",
    value: PROJECT_STATUS.ARCHIVE,
  },
];
