import express from "express";
import * as AttendanceController from "../controllers/attendanceController.js";
import * as DailySummaryController from "../controllers/dailySummaryController.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(authorizeRoles("employee"));

router.post("/punchin", AttendanceController.punchIn);
router.post("/punchout", AttendanceController.punchOut);
router.get("/records", AttendanceController.todayRecords);
router.get("/punch-status", AttendanceController.punchStatus);

router.post("/daily-summary", DailySummaryController.createDailySummary);
router.get("/history", DailySummaryController.getUserPunches);

export default router;
