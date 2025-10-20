import { Component } from "react";
import { useHistory } from "../../hooks/employee/useHistory";
import ComponentLoader from "../common/ComponentLoader";

const HistoryContent = () => {
  const { loading, historyData } = useHistory();
  
  if (loading) {
    return <ComponentLoader/>
  }

  return (
    <div className="flex-1 flex flex-col rounded-lg p-12">
      <div className="flex-1 flex flex-col overflow-x-auto">
        {historyData && historyData.length > 0  ? (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b">
                {[
                  "#", "Date", "Reg. Hrs", "Late", "Overtime", "Undertime", "Night Dif.",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {historyData.map((history, index) => (
                <tr key={history.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{history.createdAt}</td>
                  <td className="px-6 py-4">{history.regular}</td>
                  <td className="px-6 py-4">{history.late}</td>
                  <td className="px-6 py-4">{history.overtime}</td>
                  <td className="px-6 py-4">{history.undertime}</td>
                  <td className="px-6 py-4">{history.nightDifferential}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className=" flex-1 flex flex-col justify-center items-center rounded-xl border border-slate-200">
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
    </div>
  );
};

export default HistoryContent;
