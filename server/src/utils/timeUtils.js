export const dateKey = () => {
  const now = new Date();
  return now.toISOString().split("T")[0];
};

export function timeToDecimal(timeString) {
  if (!timeString) return 0;
  const [hours = 0, minutes = 0, seconds = 0] = timeString.split(":").map(Number);
  return hours + minutes / 60 + seconds / 3600;
}

export function getMondayAndFridayKeys() {
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday, 1 = Monday, ...
  const monday = new Date(today);
  const friday = new Date(today);

  const diffToMonday = day === 0 ? -6 : 1 - day;
  const diffToFriday = diffToMonday + 4;

  monday.setDate(today.getDate() + diffToMonday);
  friday.setDate(today.getDate() + diffToFriday);

  const mondayKey = monday.toISOString().split("T")[0];
  const fridayKey = friday.toISOString().split("T")[0];

  return { mondayKey, fridayKey };
}
