import * as AttendanceService from "../services/attendance.js";

export const punchIn = async (req, res) => {
  try {
    const { uid } = req.user;
    const result = await AttendanceService.punchIn(uid);

    if (!result) {
      return res.json({
        success: false,
        data: null
      });
    }

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const punchOut = async (req, res) => {
    try {
    const { uid } = req.user;
    const result = await AttendanceService.punchOut(uid);

    if (!result) {
      return res.json({
        success: false,
        data: null
      });
    }
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

export const todayRecords = async (req, res) => {
    try {
    const { uid } = req.user;
    const data = await AttendanceService.getTodayRecords(uid);

    if (!data) {
      return res.json({
        success: false,
        data: null
      });
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};

export const punchStatus = async (req, res) => {
  try {
    const { uid } = req.user;

    const data = await AttendanceService.getPunchStatus(uid);

    return res.status(200).json({
      success: true,
      data: data || null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
    });
  }
};


