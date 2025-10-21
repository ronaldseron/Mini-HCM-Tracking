import * as AdminService from "../services/admin.js";
import * as UserRepo from "../repositories/user.js";
import { formatPunch, formatUserSummary } from "../utils/formatUtils.js";

export const allEmployees = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const lastVisible = req.query.lastVisible || null;
 
    const { data, total, lastVisible: newCursor } = await AdminService.getAllEmployees(limit, lastVisible);

    res.status(200).json({
      success: true,
      data: data || [],
      total: total || 0,
      lastVisible: newCursor || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};

export const employeePunches = async (req, res) => {
  try {
    const { uid } = req.params;
    const punches = await AdminService.getEmployeePunches(uid);
    const user = await UserRepo.getUserByUid(uid);
    const timezone = user?.timezone;

    if (!punches || punches.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
      });
    }

    const formatted = punches.map((punch) => formatPunch(punch, timezone));

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
    });
  }
};

export const updateEmployeePunches = async (req, res) => {
  try {
    const { uid, punchId } = req.params;
    const updatedData = req.body;
    const punch = await AdminService.editEmployeePunch(uid, punchId, updatedData);

    if (!punch) {
      return res.status(404).json({
        success: false,
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      data: punch,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
    });
  }
};

const sendPaginatedSummary = (res, dataObj) => {
  const { data, total, lastVisible } = dataObj;
  const formatted = data.map(formatUserSummary);

  return res.status(200).json({
    success: true,
    data: formatted,
    total: total || 0,
    lastVisible: lastVisible || null,
  });
};

export const getUsersWithDailySummary = async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const lastVisible = req.query.lastVisible || null;

    const dataObj = await AdminService.getUsersWithDailySummary(limit, lastVisible);

    return sendPaginatedSummary(res, dataObj);
  } catch (error) {
    return res.status(500).json({
      success: false,
    });
  }
};

export const getUsersWithWeeklySummary = async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const lastVisible = req.query.lastVisible || null;

    const dataObj = await AdminService.getUsersWithWeeklySummary(limit, lastVisible);

    return sendPaginatedSummary(res, dataObj);
  } catch (error) {
    return res.status(500).json({
      success: false,
    });
  }
};
