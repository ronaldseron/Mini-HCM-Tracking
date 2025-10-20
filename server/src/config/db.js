import { db } from "./firebase.js";

export const usersCollection = db.collection("users");
export const attendanceCollection = db.collection("attendance");
export const dailySummaryCollection = db.collection("dailySummary");