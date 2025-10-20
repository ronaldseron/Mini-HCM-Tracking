import { useTodayRecords } from "../../hooks/employee/useTodayRecords";
import ComponentLoader from "../common/ComponentLoader";

const RecordsContent = () => {
  const { todayRecords, loading } = useTodayRecords();

  if (loading) {
    return <ComponentLoader/>
  }
  const summaryCards = [
    {
      title: "Regular Hours",
      value: todayRecords?.regular || "0h",
      icon: "bx-clock-5",
      color: "bg-slate-50 text-slate-700 border-slate-200",
      iconBg: "bg-slate-100"
    },
    {
      title: "Night Differential",
      value: todayRecords?.nightDifferential || "0h",
      icon: "bx-moon",
      color: "bg-slate-50 text-slate-700 border-slate-200",
      iconBg: "bg-slate-100"
    },
    {
      title: "Overtime",
      value: todayRecords?.overtime || "0h",
      icon: "bx-trending-up",
      color: "bg-slate-50 text-slate-700 border-slate-200",
      iconBg: "bg-slate-100"
    },
    {
      title: "Late",
      value: todayRecords?.late || "0h",
      icon: "bx-alarm-exclamation",
      color: "bg-slate-50 text-slate-700 border-slate-200",
      iconBg: "bg-slate-100"
    },
    {
      title: "Undertime",
      value: todayRecords?.undertime || "0h",
      icon: "bx-hourglass",
      color: "bg-slate-50 text-slate-700 border-slate-200",
      iconBg: "bg-slate-100"
    }
  ];

  return (
    <div className="flex-1 flex flex-col p-12">
        {todayRecords ? (
          <div className="space-y-6">
            <div className="">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <div className="h-1 w-8 bg-slate-400 rounded-full"></div>
                Today's Summary
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {summaryCards.map((card, index) => (
                  <div
                    key={index}
                    className={`${card.color} border rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:scale-105`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`${card.iconBg} p-2.5 rounded-lg`}>
                        <i className={`bx ${card.icon} text-2xl`}></i>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium opacity-80">
                        {card.title}
                      </p>
                      <p className="text-2xl font-bold">
                        {card.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white flex-1 flex flex-col items-center justify-center rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <i className="bx bx-error-circle text-4xl text-slate-400"></i>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              No Data Available
            </h3>
            <p className="text-slate-500">
              There are no attendance records for today yet.
            </p>
          </div>
        )}
    </div>
  );
};

export default RecordsContent
