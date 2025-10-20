import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getAllEmployees } from "../../services/adminService";

export const useDashboard = () => {
  const { getUserToken } = useAuth();
  const cursors = useRef({});

  const [allEmployees, setAllEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [empPage, setEmpPage] = useState(1);
  const [empPerPage, setEmpPerPage] = useState(10);
  const [totalEmployees, setTotalEmployees] = useState(0);

  const fetchAllEmployees = async () => {
    try {
      const token = await getUserToken();
      if (!token) return;

      const lastVisible = empPage > 1 && cursors.current[empPage - 1]
        ? cursors.current[empPage - 1]
        : null;

      const result = await getAllEmployees(token, empPerPage, lastVisible);
      if (result.success) {
        setAllEmployees(result.data || []);
        if (result.total !== undefined) setTotalEmployees(result.total);
        if (result.lastVisible) cursors.current[empPage] = result.lastVisible;
      }
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    fetchAllEmployees();
  }, [empPage, empPerPage]);

  return {
    allEmployees,
    loadingEmployees,
    empPage,
    setEmpPage,
    empPerPage,
    setEmpPerPage,
    totalEmployees,
  };
};
