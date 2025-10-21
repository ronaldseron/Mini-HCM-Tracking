import { calculateWorkMetrics } from "../utils/attendanceUtils.js";
import { formatTimeWithoutMeridiem } from "../utils/formatUtils.js";

export const getMetricsStatus = async (attendanceData) => {
  const timeIn = formatTimeWithoutMeridiem(attendanceData.data.timeIn, attendanceData.timezone);
  const timeOut = attendanceData.data.timeOut ? formatTimeWithoutMeridiem(attendanceData.data.timeOut, attendanceData.timezone) : null;
  const schedStart = attendanceData.schedule.start;
  const schedEnd = attendanceData.schedule.end;

  const metrics = calculateWorkMetrics(timeIn, timeOut, schedStart, schedEnd);

  return metrics;
};
