import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getHistoryPunches } from "../../services/dailySummaryService";

export const useHistory = () => {
  const { getUserToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [historyData, sethistoryData] = useState([]);

  const withToken = useCallback(async (fn) => {
    const token = await getUserToken();
    return fn(token);
  }, [getUserToken]);

  const fetchHistory = useCallback(async () => {
    try {
      const token = await getUserToken();
      const result = await getHistoryPunches(token);

      if (result.success) {
        const data = result?.data || [];
        sethistoryData(prev => prev !== data ? data : prev);
      }

    } catch (err) {
      sethistoryData([]);
    } finally {
      setLoading(false);
    }
  }, [withToken]);

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    loading,
    historyData
  };
};
