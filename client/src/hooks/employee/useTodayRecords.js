import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getTodayRecords } from "../../services/attendanceService";

export const useTodayRecords = () => {
  const { getUserToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [todayRecords, setTodayRecords] = useState(null);

  const fetchTodayRecords = useCallback(async () => {
    try {
      const token = await getUserToken();
      const result = await getTodayRecords(token);
      const data = result?.data || null;

      setTodayRecords(prev => prev !== data ? data : prev);
    } catch (err) {
      setTodayRecords(null);
    } finally {
      setLoading(false);
    }
  }, [getUserToken]);

  useEffect(() => {
    fetchTodayRecords();
  }, []);

  return {
    loading,
    todayRecords,
  };
};
