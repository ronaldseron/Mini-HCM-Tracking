export const toDate = (timestamp) => {
  if (!timestamp?._seconds) return null;
  return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6);
};

export const toTimestamp = (timeStr, baseDate, admin, timezone) => {
  if (!timeStr) return null;

  // Parse input time (e.g. "09:00:00 AM")
  const [time, modifier] = timeStr.split(" ");
  let [h, m, s] = time.split(":").map(Number);
  if (modifier === "PM" && h < 12) h += 12;
  if (modifier === "AM" && h === 12) h = 0;

  // Extract user's date components from timezone (only the DATE part matters)
  const dateInTZ = new Date(
    baseDate.toLocaleString("en-US", { timeZone: timezone })
  );
  const year = dateInTZ.getFullYear();
  const month = dateInTZ.getMonth();
  const day = dateInTZ.getDate();

  // Build a new date as if user typed time in their local TZ
  // This date is *interpreted* as UTC initially
  const localDate = new Date(Date.UTC(year, month, day, h, m, s || 0));

  // Compute Manila offset and correct to true UTC time
  const options = { timeZone: timezone };
  const utcMillis =
    localDate.getTime() -
    (new Date(localDate.toLocaleString("en-US", options)).getTime() -
      localDate.getTime());

  const adjustedDate = new Date(utcMillis);

  return admin.firestore.Timestamp.fromDate(adjustedDate);
};


export const formatDate = (timestamp, timezone) => {
  const date = toDate(timestamp);
  if (!date) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: timezone
  });
};

export const formatTimeWithMeridiem = (timestamp, timezone) => {
  const date = toDate(timestamp);
  if (!date) return "—";
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: timezone
  });
};

export const formatTimeWithoutMeridiem = (timestamp, timezone) => {
  const date = toDate(timestamp);
  if (!date) return "—";
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: timezone
  });
};

export function decimalToHMS(decimalHours) {
  const hours = Math.floor(decimalHours);
  const minutesDecimal = (decimalHours - hours) * 60;
  const minutes = Math.floor(minutesDecimal);
  const seconds = Math.round((minutesDecimal - minutes) * 60);

  const displayTime = `${hours}h ${minutes}m ${seconds}s`;

  return displayTime;
}

export function convertMetricsToHMS(metrics) {
  const result = {};
  for (const [key, value] of Object.entries(metrics)) {
    result[key] = decimalToHMS(Number(value));
  }
  return result;
}

export const formatPunch = (punch, timezone) => ({
  id: punch.id,
  timeIn: formatTimeWithMeridiem(punch.timeIn, timezone),
  timeOut: punch.timeOut ? formatTimeWithMeridiem(punch.timeOut, timezone) : null,
  date: formatDate(punch.createdAt, timezone),
});

export const formatUserSummary = (user) => {
  if (!user.summary) return { ...user, summary: null };
  const formattedSummary = Object.fromEntries(
    Object.entries(user.summary).map(([k, v]) => [k, decimalToHMS(v)])
  );
  return { ...user, summary: formattedSummary };
};
