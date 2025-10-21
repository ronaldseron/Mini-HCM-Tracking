import admin from "../config/firebase.js";
import { usersCollection } from "../config/db.js";
import { dateKey } from "../utils/timeUtils.js";

export const createUser = async (uid, name, email) => {
    const userData = {
        uid,
        name,
        email,
        role: 'employee',
        timezone: 'Asia/Manila',
        schedule: { start: '09:00', end: '18:00' },
        createAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    await usersCollection.doc(uid).set(userData);

    return userData;
};

export const getUserByUid = async (uid) => {
    const userDoc = await usersCollection.doc(uid).get();
    return userDoc.exists ? { ...userDoc.data() } : null;
};

export const createDateKey = async (uid) => {
    const userDoc = await usersCollection.doc(uid).get();
    if (!userDoc.exists) return null;
    const timezone = userDoc.data().timezone;
    const date = dateKey(timezone);

    return `${uid}_${date}`;
};