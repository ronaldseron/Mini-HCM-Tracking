import LiveClock from "../../components/employee/LiveClock";
import PunchCard from "../../components/employee/PunchCard";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import ToastNotification from "../../components/common/ToastNotification";
import { usePunches } from "../../hooks/employee/usePunches";

const Dashboard = () => {
  const { loading, actionLoading, toast, isPunchedIn, handlePunchIn, handlePunchOut } = usePunches();

  return (
    <EmployeeLayout>
      <LiveClock />

      <PunchCard
        handlePunchIn={handlePunchIn}
        handlePunchOut={handlePunchOut}
        loading={loading}
        actionLoading={actionLoading}
        isPunchedIn={isPunchedIn}
      />

      <ToastNotification
        show={toast.show}
        type={toast.type}
        message={toast.message}
      />
    </EmployeeLayout>
  );
};

export default Dashboard;
