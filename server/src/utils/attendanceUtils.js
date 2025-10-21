import { timeToDecimal } from "./timeUtils.js";

export function calculateWorkMetrics(timeIn, timeOut, schedStart, schedEnd, timezone) {
  const tIn = timeToDecimal(timeIn);
  const sStart = timeToDecimal(schedStart);
  const sEnd = timeToDecimal(schedEnd);

  const current = new Date().toLocaleString("en-US", { timeZone: timezone });
  const [hours, minutes, seconds] = current
    .split(", ")[1] 
    .split(":")
    .map(Number);

  // Convert to 24-hour decimal
  let h = hours;
  if (current.includes("PM") && h < 12) h += 12;
  if (current.includes("AM") && h === 12) h = 0;
  const currentDecimal = h + minutes / 60 + (seconds || 0) / 3600;

  const tOut = timeOut ? timeToDecimal(timeOut) : currentDecimal;

  if (!tIn || !sStart || !sEnd) {
    return {
      regularHours: "0.00",
      overtimeHours: "0.00",
      undertimeHours: "0.00",
      lateMinutes: "0",
      nightDifferentialHours: "0.00",
    };
  }

  const lateMinutes = Math.max(0, tIn - sStart);

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

  // Calulate all metrics
  const workedHours = Math.max(0, tOut - tIn);
  const regularHours = Math.min(workedHours, sEnd - sStart);
  const overtimeHours = Math.max(0, tOut - sEnd);
  const undertimeHours = Math.max(0, sEnd - tOut);

  // Night Differential
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
