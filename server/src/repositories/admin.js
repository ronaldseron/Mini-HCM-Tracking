import admin from "../config/firebase.js";
import { usersCollection, attendanceCollection, dailySummaryCollection } from "../config/db.js";
import { dateKey, getMondayAndFridayKeys } from "../utils/timeUtils.js";
import { toTimestamp } from "../utils/formatUtils.js";
import * as UserRepo from "../repositories/user.js";

export const totalEmployees = async () => {
  const users = await usersCollection.where("role", "==", "employee").get();
  return users.size;
};

export const fetchAllEmployees = async (limit, lastVisibleId) => {
  let query = usersCollection
    .where("role", "==", "employee")
    .orderBy("name", "asc")
    .limit(limit);

  if (lastVisibleId) {
    const lastDoc = await usersCollection.doc(lastVisibleId).get();
    if (lastDoc.exists) query = query.startAfter(lastDoc);
  }

  const snapshot = await query.get();

  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const lastVisibleDoc =
    snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
  const total = await totalEmployees();

  return {
    data,
    total,
    lastVisible: lastVisibleDoc ? lastVisibleDoc.id : null,
  };
};

export const fetchEmployeePunches = async (uid) => {
  const snapshot = await attendanceCollection.where("uid", "==", uid).orderBy("createdAt", "desc").get();
  const punches = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return punches;
};

export const updateEmployeePunch = async (uid, punchId, updatedData) => {
  const docRef = attendanceCollection.doc(punchId);
  const docSnap = await docRef.get();
  if (!docSnap.exists) return null;
  
  const baseDate = docSnap.data().createdAt.toDate();
  const user = await UserRepo.getUserByUid(uid);
  const timezone = user?.timezone;

  const updatedFields = {
    ...(updatedData.timeIn && {
      timeIn: toTimestamp(updatedData.timeIn, baseDate, admin, timezone),
    }),
    ...(updatedData.timeOut && {
      timeOut: toTimestamp(updatedData.timeOut, baseDate, admin, timezone),
    }),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await docRef.update(updatedFields);
  const updatedDoc = await docRef.get();
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

export const fetchEmployeeAttendanceById = async (uid, punchId) => {
  const punchSnap = await attendanceCollection.doc(punchId).get();
  if (!punchSnap.exists) return null;

  const userSnap = await usersCollection.doc(uid).get();
  return {
    data: punchSnap.data(),
    schedule: userSnap.data()?.schedule,
    timezone: userSnap.data()?.timezone,
  };
};

export const fetchAllUsersWithDailySummaries = async (uid, limitCount = 10, lastVisibleId) => {
  const timezoneUser = await UserRepo.getUserByUid(uid);
  const timezone = timezoneUser?.timezone;
  const todayStr = dateKey(timezone);

  let query = usersCollection
    .where("role", "==", "employee")
    .orderBy("name", "asc")
    .limit(limitCount);

  if (lastVisibleId) {
    const lastVisibleDoc = await usersCollection.doc(lastVisibleId).get();
    if (lastVisibleDoc.exists) {
      query = query.startAfter(lastVisibleDoc);
    }
  }

  const usersSnap = await query.get();

  const summariesSnap = await dailySummaryCollection.get();
  const todaySummaries = summariesSnap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter(
      (summary) =>
        summary.createdAt.toDate().toISOString().split("T")[0] === todayStr
    );

  const summariesMap = Object.fromEntries(
    todaySummaries.map((s) => [s.uid, s])
  );

  const lastVisibleDoc =
    usersSnap.docs.length > 0
      ? usersSnap.docs[usersSnap.docs.length - 1]
      : null;

  const totalSnap = await usersCollection.where("role", "==", "employee").get();

  return {
    data: usersSnap.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      summary: summariesMap[doc.id] || null,
    })),
    total: totalSnap.size,
    lastVisible: lastVisibleDoc ? lastVisibleDoc.id : null,
  };
};

export const fetchAllUsersWithWeeklySummaries = async (uid, limitCount = 10, lastVisibleId) => {
  const timezoneUser = await UserRepo.getUserByUid(uid);
  const timezone = timezoneUser?.timezone;
  const { mondayKey, fridayKey } = getMondayAndFridayKeys(timezone);

  let query = usersCollection
    .where("role", "==", "employee")
    .orderBy("name", "asc")
    .limit(limitCount);

  if (lastVisibleId) {
    const lastVisibleDoc = await usersCollection.doc(lastVisibleId).get();
    if (lastVisibleDoc.exists) {
      query = query.startAfter(lastVisibleDoc);
    }
  }

  const usersSnap = await query.get();

  const summariesSnap = await dailySummaryCollection
    .where("createdAt", ">=", new Date(mondayKey))
    .where("createdAt", "<=", new Date(fridayKey))
    .get();

  const userSummariesMap = {};
  for (const doc of summariesSnap.docs) {
    const { uid, regular, late, overtime, undertime, nightDifferential } =
      doc.data();
    if (!userSummariesMap[uid]) {
      userSummariesMap[uid] = {
        regular: 0,
        late: 0,
        overtime: 0,
        undertime: 0,
        nightDifferential: 0,
      };
    }
    userSummariesMap[uid].regular += parseFloat(regular || 0);
    userSummariesMap[uid].late += parseFloat(late || 0);
    userSummariesMap[uid].overtime += parseFloat(overtime || 0);
    userSummariesMap[uid].undertime += parseFloat(undertime || 0);
    userSummariesMap[uid].nightDifferential += parseFloat(
      nightDifferential || 0
    );
  }

  const data = usersSnap.docs.map((userDoc) => ({
    id: userDoc.id,
    name: userDoc.data().name,
    summary: userSummariesMap[userDoc.id] || null,
  }));

  const lastVisibleDoc =
    usersSnap.docs.length > 0
      ? usersSnap.docs[usersSnap.docs.length - 1]
      : null;

  const totalSnap = await usersCollection.where("role", "==", "employee").get();

  return {
    data,
    total: totalSnap.size,
    lastVisible: lastVisibleDoc ? lastVisibleDoc.id : null,
  };
};
