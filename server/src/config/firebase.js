  import admin from "firebase-admin";
  import { readFileSync } from "fs";

  const serviceAccount = JSON.parse(
    readFileSync("/etc/secrets/hcm-time-tracking-48f97-firebase-adminsdk-fbsvc-92d68c6563.json", "utf8")
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  export const db = admin.firestore();
  export const auth = admin.auth();
  export default admin;