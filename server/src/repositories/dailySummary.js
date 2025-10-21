import admin from "../config/firebase.js";
import { dailySummaryCollection } from "../config/db.js";
import * as UserRepo from "../repositories/user.js";

export const createDailySummary = async (uid, todayMetrics) => {
  const docId = UserRepo.createDateKey(uid);
  const docRef = dailySummaryCollection.doc(docId);

  await docRef.set({
    uid,
    ...todayMetrics,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { id: docId };
};

export const getPunchesByUserId = async (uid) => {
  const snapshot = await dailySummaryCollection.where("uid", "==", uid).orderBy("createdAt", "desc").get();
  if (snapshot.empty) return [];

  const punches = snapshot.docs.map((doc) => {
    const data = doc.data();
    const { createdAt, uid: userId, ...metrics } = data;
    return {
      id: doc.id,
      uid: userId,
      data: metrics,
      createdAt,
    };
  });

  return punches;
};

export const updateEmployeeSummaryById = async (summaryId, todayMetrics) => {
  await dailySummaryCollection.doc(summaryId).update({
    ...todayMetrics,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { id: summaryId };
};
