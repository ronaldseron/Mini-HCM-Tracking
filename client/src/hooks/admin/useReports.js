import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getEmployeesDailySummary, getEmployeesWeeklySummary } from "../../services/adminService";

export const useReports = (activeTab) => {
  const { getUserToken } = useAuth();
  const cursorsDaily = useRef({});
  const cursorsWeekly = useRef({});
  const hasFetchedWeekly = useRef(false);

  const [dailySummary, setDailySummary] = useState([]);
  const [loadingDaily, setLoadingDaily] = useState(true);
  const [dailyPage, setDailyPage] = useState(1);
  const [dailyPerPage, setDailyPerPage] = useState(10);
  const [totalDaily, setTotalDaily] = useState(0);

  const fetchDailySummary = async () => {
    try {
      const token = await getUserToken();
      if (!token) return;

      const lastVisible = dailyPage > 1 && cursorsDaily.current[dailyPage - 1]
        ? cursorsDaily.current[dailyPage - 1]
        : null;

      const result = await getEmployeesDailySummary(token, dailyPerPage, lastVisible);
      if (result.success) {
        setDailySummary(result.data || []);
        setTotalDaily(result.total ?? 0);
        if (result.lastVisible) cursorsDaily.current[dailyPage] = result.lastVisible;
      }
    } finally {
      setLoadingDaily(false);
    }
  };

  useEffect(() => {
    fetchDailySummary();
  }, [dailyPage, dailyPerPage]);

  const [weeklySummary, setWeeklySummary] = useState([]);
  const [loadingWeekly, setLoadingWeekly] = useState(false);
  const [weeklyPage, setWeeklyPage] = useState(1);
  const [weeklyPerPage, setWeeklyPerPage] = useState(10);
  const [totalWeekly, setTotalWeekly] = useState(0);

  const fetchWeeklySummary = async () => {
    try {
      setLoadingWeekly(true);
      const token = await getUserToken();
      if (!token) return;

      const lastVisible = weeklyPage > 1 && cursorsWeekly.current[weeklyPage - 1]
        ? cursorsWeekly.current[weeklyPage - 1]
        : null;

      const result = await getEmployeesWeeklySummary(token, weeklyPerPage, lastVisible);
      if (result.success) {
        setWeeklySummary(result.data || []);
        setTotalWeekly(result.total ?? 0);
        if (result.lastVisible) cursorsWeekly.current[weeklyPage] = result.lastVisible;
      }
    } finally {
      setLoadingWeekly(false);
    }
  };

  useEffect(() => {
    if (activeTab === "weekly" && !hasFetchedWeekly.current) {
      fetchWeeklySummary();
      hasFetchedWeekly.current = true;
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "weekly" && hasFetchedWeekly.current) {
      fetchWeeklySummary();
    }
  }, [weeklyPage, weeklyPerPage]);

  return {
    dailySummary,
    loadingDaily,
    dailyPage,
    setDailyPage,
    dailyPerPage,
    setDailyPerPage,
    totalDaily,
    weeklySummary,
    loadingWeekly,
    weeklyPage,
    setWeeklyPage,
    weeklyPerPage,
    setWeeklyPerPage,
    totalWeekly,
  };
};
