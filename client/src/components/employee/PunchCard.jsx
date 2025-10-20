import { memo } from "react";
import ComponentLoader from "../common/ComponentLoader";

const PunchCard = memo(({ handlePunchIn, handlePunchOut, loading, actionLoading, isPunchedIn }) => {
  
  if (loading) {
    return <ComponentLoader/>
  }

  return (
    <div className="flex-1 w-200 flex self-center items-stretch justify-center my-12 gap-14">
      <button
        onClick={handlePunchIn}
        className={`flex-1 flex items-center justify-center bg-accent text-white rounded-4xl text-5xl font-extrabold ${
          isPunchedIn || actionLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        disabled={isPunchedIn || actionLoading}
      >
        {actionLoading && !isPunchedIn ? "Punch In..." : "Punch In"}
      </button>

      <button
        onClick={handlePunchOut}
        className={`flex-1 flex items-center justify-center bg-accent text-white rounded-4xl text-5xl font-extrabold ${
          !isPunchedIn || actionLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        disabled={!isPunchedIn || actionLoading}
      >
        {actionLoading && isPunchedIn ? "Punch Out..." : "Punch Out"}
      </button>
    </div>
  );
});

export default PunchCard;
