import { MeasurementUnitKey, MeasurementUnitValue } from "@/types";

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
