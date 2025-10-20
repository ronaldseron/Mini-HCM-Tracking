import { timeToDecimal } from "./timeUtils.js";

export function calculateWorkMetrics(timeIn, timeOut, schedStart, schedEnd) {
  const tIn = timeToDecimal(timeIn);
  const sStart = timeToDecimal(schedStart);
  const sEnd = timeToDecimal(schedEnd);

  // Use current time if no timeOut
  const current = new Date();
  const currentDecimal =
    current.getHours() + current.getMinutes() / 60 + current.getSeconds() / 3600;

  const tOut = timeOut ? timeToDecimal(timeOut) : currentDecimal;

  // Guard invalid times
  if (!tIn || !sStart || !sEnd) {
    return {
      regularHours: "0.00",
      overtimeHours: "0.00",
      undertimeHours: "0.00",
      lateMinutes: "0",
      nightDifferentialHours: "0.00",
    };
  }

  // Late (in minutes)
  const lateMinutes = Math.max(0, (tIn - sStart));

  // If timeOut missing → only compute late & regular so far
  if (!timeOut) {
    const hoursWorkedSoFar = Math.max(0, tOut - tIn);
    const regularHours = Math.min(hoursWorkedSoFar, sEnd - sStart);

    return {
      regular: regularHours.toFixed(6),
      overtime: "0.00",
      undertime: "0.00",
      late: lateMinutes.toFixed(6),
      nightDifferential: "0.00",
    };
  }

  // If timeOut exists → compute all metrics
  const workedHours = Math.max(0, tOut - tIn);
  const regularHours = Math.min(workedHours, sEnd - sStart);
  const overtimeHours = Math.max(0, tOut - sEnd);
  const undertimeHours = Math.max(0, sEnd - tOut);

  // Night Differential (22:00–06:00)
  const nightStart = 22;
  const nightEnd = 6;
  let ndHours = 0;

  if (tOut > nightStart || tIn < nightEnd) {
    if (tOut > nightStart) ndHours += Math.max(0, Math.min(tOut, 24) - nightStart);
    if (tIn < nightEnd) ndHours += Math.max(0, nightEnd - tIn);
  }

  return {
    regular: regularHours.toFixed(6),
    overtime: overtimeHours.toFixed(6),
    undertime: undertimeHours.toFixed(6),
    late: lateMinutes.toFixed(6),
    nightDifferential: ndHours.toFixed(6),
  };
}
