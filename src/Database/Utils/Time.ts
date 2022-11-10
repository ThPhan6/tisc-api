import moment, { Moment } from "moment";

export const getTimestamps = () => {
  return moment().format("YYYY-MM-DD HH:mm:ss");
};

export const getDiff = (
  time1: Moment,
  time2: Moment,
  unit: moment.unitOfTime.Diff
) => {
  return time1.diff(time2, unit);
};
