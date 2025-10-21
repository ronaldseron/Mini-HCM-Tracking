import * as AdminRepo from "../repositories/admin.js";
import { getMetricsStatus } from "./attendanceService.js";
import { updateEmployeeSummaryById } from "../repositories/dailySummary.js";

export const getAllEmployees = async (limit, lastVisible) => {
  return await AdminRepo.fetchAllEmployees(limit, lastVisible);
};

export const getEmployeePunches = (uid) => AdminRepo.fetchEmployeePunches(uid);

export const getUsersWithDailySummary = async (uid, limit, lastVisible) => {
  return await AdminRepo.fetchAllUsersWithDailySummaries(uid, limit, lastVisible);
}

export const getUsersWithWeeklySummary = async (uid, limit, lastVisible) =>{
  return await AdminRepo.fetchAllUsersWithWeeklySummaries(uid, limit, lastVisible);
} 

export const editEmployeePunch = async (uid, punchId, updatedData) => {
  const punch = await AdminRepo.updateEmployeePunch(uid, punchId, updatedData);
  const attendanceData = await AdminRepo.fetchEmployeeAttendanceById(uid, punch.id);
  const metrics = await getMetricsStatus(attendanceData);
  
  await updateEmployeeSummaryById(punch.id, metrics);

  return punch;
};