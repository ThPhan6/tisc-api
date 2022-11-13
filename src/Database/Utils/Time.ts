import moment from "moment";

export const getTimestamps = () => {
  return moment().format("YYYY-MM-DD HH:mm:ss");
};
