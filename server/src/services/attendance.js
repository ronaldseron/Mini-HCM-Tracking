import admin from "../config/firebase.js";
import * as AttendanceRepo from "../repositories/attendance.js";
import * as UserRepo from "../repositories/user.js";
import { getMetricsStatus } from "./attendanceService.js";
import { convertMetricsToHMS } from "../utils/formatUtils.js";

export const punchIn = async (uid) => {
   const record = await AttendanceRepo.getAttendanceByUserAndDate(uid);

   if (record.exists && record.data.timeIn) {
      return { message: "Already puched in today.", status: false };
   }

   await AttendanceRepo.createAttendance(uid);

   return { message: "Punched in successfully.", status: true };
};

export const punchOut = async (uid) => {
   const record = await AttendanceRepo.getAttendanceByUserAndDate(uid);
 
   if (record.data.timeOut) {
      return { message: "Already punched out today." };
   }
 
   await AttendanceRepo.updateAttendance(uid, {
     timeOut: admin.firestore.FieldValue.serverTimestamp(),
   });
 
   return { message: "Punched out successfully." };
};

export const getTodayRecords = async (uid) => {
   const record = await AttendanceRepo.getAttendanceByUserAndDate(uid);

   if (!record.exists) return null;
 
   const user = await UserRepo.getUserByUid(uid);
   const schedule = user?.schedule;
   const timezone = user?.timezone;
 
   const { timeIn, timeOut } = record.data;
   const metrics = await getMetricsStatus({ data: record.data, schedule, timezone });
   const hms = convertMetricsToHMS(metrics);
 
   return {
     ...hms,
     timeIn,
     timeOut,
     schedule,
   };
};

export const getPunchStatus = async (uid) => {
   const record = await AttendanceRepo.getAttendanceByUserAndDate(uid);
   if (!record.exists) return null;
 
   const { timeIn, timeOut } = record.data;
 
   return {
     timeIn,
     timeOut,
   };
};