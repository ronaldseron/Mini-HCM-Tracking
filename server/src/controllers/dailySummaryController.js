import * as DailySummaryService from "../services/dailySummary.js";

export const createDailySummary = async (req, res) => {
  try {
    const { uid } = req.user;
    const data = await DailySummaryService.createDailySummary(uid);

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getUserPunches = async (req, res) => {
  try {
    const { uid } = req.user;
    const punches = await DailySummaryService.getUserPunches(uid);

    res.status(200).json({
      success: true,
      data: punches,
      message: punches.length ? "Punches fetched successfully." : "No punches found.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
