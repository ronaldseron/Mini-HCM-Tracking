export const dateKey = (timezone) => {
  const now = new Date();
  const formatted = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  return formatted;
};


export function timeToDecimal(timeString) {
  if (!timeString) return 0;
  const [hours = 0, minutes = 0, seconds = 0] = timeString.split(":").map(Number);
  return hours + minutes / 60 + seconds / 3600;
}

export function getMondayAndFridayKeys(userTimezone) {
  const timezone = userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const today = new Date(
    new Date().toLocaleString("en-US", { timeZone: timezone })
  );

  const day = today.getDay();
  const monday = new Date(today);
  const friday = new Date(today);

  const diffToMonday = day === 0 ? -6 : 1 - day;
  const diffToFriday = diffToMonday + 4;

  monday.setDate(today.getDate() + diffToMonday);
  friday.setDate(today.getDate() + diffToFriday);

  const mondayKey = monday.toLocaleDateString("en-CA", { timeZone: timezone });
  const fridayKey = friday.toLocaleDateString("en-CA", { timeZone: timezone });

  return { mondayKey, fridayKey };
}

