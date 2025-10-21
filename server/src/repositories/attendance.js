import admin from "../config/firebase.js";
import { attendanceCollection } from "../config/db.js";
import * as UserRepo from "../repositories/user.js";

export const getAttendanceByUserAndDate = async (uid) => {
    const docId = await UserRepo.createDateKey(uid);
    const docRef = attendanceCollection.doc(docId);
    const snapshot = await docRef.get();

    return { id: docId, exists: snapshot.exists, data: snapshot.data() };
};

export const createAttendance = async (uid) => {
    const docId = await UserRepo.createDateKey(uid);
    const docRef = attendanceCollection.doc(docId);

    await docRef.set({
        uid,
        timeIn: admin.firestore.FieldValue.serverTimestamp(),
        timeOut: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    return { id: docId };
}

export const updateAttendance = async (uid, updateData) => {
    const docId = await UserRepo.createDateKey(uid);
    const docRef = attendanceCollection.doc(docId);

    await docRef.update({
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
};  