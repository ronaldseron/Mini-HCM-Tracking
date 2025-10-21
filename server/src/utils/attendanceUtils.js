import { timeToDecimal } from "./timeUtils.js";

export function calculateWorkMetrics(timeIn, timeOut, schedStart, schedEnd, timezone) {
  const tIn = timeToDecimal(timeIn);
  const sStart = timeToDecimal(schedStart);
  const sEnd = timeToDecimal(schedEnd);

  if (!tIn || !sStart || !sEnd) {
    return {
      regular: "0.00",
      overtime: "0.00",
      undertime: "0.00",
      late: "0.00",
      nightDifferential: "0.00",
    };
  }

  // Use current time in user's timezone if no timeOut
  let tOut;
  if (timeOut) {
    tOut = timeToDecimal(timeOut);
  } else {
    const now = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const [h, m, s] = now.split(":").map(Number);
    tOut = h + m / 60 + s / 3600;
  }

  // Late in hours
  const lateHours = Math.max(0, tIn - sStart);

  // If timeOut is missing → calculate only regular and late
  if (!timeOut) {
    const hoursWorkedSoFar = Math.max(0, tOut - tIn);
    const regularHours = Math.min(hoursWorkedSoFar, sEnd - sStart);

    return {
      regular: regularHours.toFixed(6),
      overtime: "0.00",
      undertime: "0.00",
      late: lateHours.toFixed(6),
      nightDifferential: "0.00",
    };
  }

  // If timeOut exists → compute all metrics
  const workedHours = Math.max(0, tOut - tIn);
  const regularHours = Math.min(workedHours, sEnd - sStart);
  const overtimeHours = tOut > sEnd ? tOut - sEnd : 0;
  const undertimeHours = tOut < sEnd ? sEnd - tOut : 0;

  // Night differential (22:00–06:00)
  const nightStart = 22;
  const nightEnd = 6;
  let ndHours = 0;
  if (tOut > nightStart) ndHours += Math.min(tOut, 24) - nightStart;
  if (tIn < nightEnd) ndHours += nightEnd - Math.max(tIn, 0);

  return {
    regular: regularHours.toFixed(6),
    overtime: overtimeHours.toFixed(6),
    undertime: undertimeHours.toFixed(6),
    late: lateHours.toFixed(6),
    nightDifferential: ndHours.toFixed(6),
  };
}
