import express from "express";
import * as AdminController from "../controllers/adminController.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(authorizeRoles("admin"));

router.get("/dashboard", AdminController.allEmployees);
router.get("/daily-summary", AdminController.getUsersWithDailySummary);
router.get("/weekly-summary", AdminController.getUsersWithWeeklySummary);
router.get("/:uid/attendance", AdminController.employeePunches);
router.put("/:uid/attendance/:punchId", AdminController.updateEmployeePunches);

export default router;
