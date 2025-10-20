import { usersCollection } from "../config/db.js";

export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.uid) {
        return res.status(401)
      }

      const userRef = usersCollection.doc(req.user.uid);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
        return res.status(404)
      }

      const userData = userSnap.data();
      const userRole = userData.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403)
      }

      next();
    } catch (error) {
      res.status(500)
    }
  };
};
