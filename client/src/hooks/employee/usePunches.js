import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { punchInService, punchOutService, getPunchStatus } from "../../services/attendanceService";
import { createDailySummary } from "../../services/dailySummaryService";

export const usePunches = () => {
  const { userData, withToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [isPunchedIn, setIsPunchedIn] = useState(false);

  const showToast = useCallback((type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  }, []);

  const handlePunchIn = useCallback(async () => {
    setActionLoading(true)
    try {
      const result = await withToken(punchInService);

      if (result.success) {
        setIsPunchedIn(result.data.status);
        showToast("success", result.data.message);
      } else {
        showToast("error", "Failed to punch in. Please try again!");
      }
    } catch (err) {
      showToast("error", "An error occurred while punching in.");
    } finally {
      setActionLoading(false);
    }
  }, [withToken]);

  const handlePunchOut = useCallback(async () => {
    setActionLoading(true);
    try {
      const result = await withToken(punchOutService);

      if (result.success) {
        await withToken(createDailySummary);
        setIsPunchedIn(false);
        showToast("success", result.data.message);
      } else {
        showToast("error", "Failed to punch out. Please try again.");
      }
    } catch (err) {
      showToast("error", "Failed to punch out. Please try again.");
    } finally {
      setActionLoading(false);
    }
  }, [withToken]);

  const fetchPunchStatus = useCallback(async () => {
    try {
      if(!userData) return;

      const result = await withToken(getPunchStatus);
      if (result.success) {
        const data = result?.data || null;
        setIsPunchedIn(!!(data?.timeIn && !data?.timeOut));
      } else {
        showToast("error", "Failed to fetch punch status. Please try again.");
      }
    } catch (error) {
      setIsPunchedIn(false);
    } finally {
      setLoading(false);
    }
  }, [userData, withToken]);

  useEffect(() => {
    fetchPunchStatus();
  }, []);

  return {
    loading,
    actionLoading,
    toast,
    isPunchedIn,
    handlePunchIn,
    handlePunchOut,
  };
};
