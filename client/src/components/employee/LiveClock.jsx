import { memo, useState, useEffect } from "react";
import moment from "moment-timezone";

const LiveClock = memo(() => {
  const [time, setTime] = useState(() =>
    moment.utc().tz("Asia/Manila").toDate()
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment.utc().tz("Asia/Manila").toDate());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = moment(time).format("dddd, MMMM Do, YYYY");
  const formattedTime = moment(time).format("h:mm:ss A");

  return (
    <div className="w-full flex flex-col items-center gap-1 select-none">
      <div className="text-md text-gray-600 mt-12">{formattedDate}</div>
      <div className="text-6xl font-bold">{formattedTime}</div>
    </div>
  );
});

export default LiveClock;
