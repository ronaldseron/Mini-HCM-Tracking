import * as DailySummaryRepo from "../repositories/dailySummary.js";
import * as AttendanceRepo from "../repositories/attendance.js";
import * as UserRepo from "../repositories/user.js";
import { getMetricsStatus } from "./attendanceService.js";
import { convertMetricsToHMS, formatDate } from "../utils/formatUtils.js";

export const createDailySummary = async (uid) => {
  const attendanceRecord = await AttendanceRepo.getAttendanceByUserAndDate(uid);
  if (!attendanceRecord.exists) return { message: "No attendance record found today." };

  const user = await UserRepo.getUserByUid(uid);
  const schedule = user?.schedule;
  const timezone = user?.timezone;

  const todayMetrics = await getMetricsStatus({ data: attendanceRecord.data, schedule, timezone });

  await DailySummaryRepo.createDailySummary(uid, todayMetrics);

  return todayMetrics;
};

export const getUserPunches = async (uid) => {
  const punches = await DailySummaryRepo.getPunchesByUserId(uid);
  if (!punches.length) return [];

  return punches.map((punch) => {
    const metricsHMS = convertMetricsToHMS(punch.data);
    return {
      id: punch.id,
      uid: punch.uid,
      createdAt: formatDate(punch.createdAt),
      ...metricsHMS,
    };
  });
};

export const updateSummary = async (summaryId, todayMetrics) => {
  return await DailySummaryRepo.updateEmployeeSummaryById(summaryId, todayMetrics);
};
