import moment from "moment-timezone";

export const toWIB = (date) => {
  if (!date) return null;
  return moment(date).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
};
