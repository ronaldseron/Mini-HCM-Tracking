import { useState, useEffect, useCallback } from "react";
import { getEmployeePunches, updateUserPunch } from "../../services/adminService";
import { formatTime } from "../../utils/timeFormat";

export const usePunchModal = (selectedEmployee, getUserToken, showModal) => {
  const [loading, setLoading] = useState(false);
  const [punches, setPunches] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedPunch, setEditedPunch] = useState({});
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const showToast = useCallback((type, message, duration = 3000) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), duration);
  }, []);

  useEffect(() => {
    if (!showModal || !selectedEmployee) return;

    const fetchPunches = async () => {
      setLoading(true);
      try {
        const token = await getUserToken();
        const res = await getEmployeePunches(selectedEmployee.id, token);
        setPunches(res.data || []);
      } catch (err) {
        setPunches([]);
        showToast("error", "Failed to load punches.");
      } finally {
        setLoading(false);
      }
    };

    fetchPunches();
  }, [showModal, selectedEmployee, getUserToken, showToast]);

  const handleEdit = (id) => {
    const punchToEdit = punches.find((p) => p.id === id);
    setEditId(id);

    setEditedPunch({
      ...punchToEdit,
      timeIn: formatTime(punchToEdit.timeIn),
      timeOut: formatTime(punchToEdit.timeOut),
    });
  };

  const handleTimeInputChange = (e, fieldName) => {
    const { value } = e.target;
    setEditedPunch((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPunch((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editedPunch || !editId) return;

    const addAmPm = (time) => {
      if (!time) return "";
      const [hours, minutes, seconds] = time.split(":").map(Number);
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${String(displayHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} ${period}`;
    };

    try {
      const token = await getUserToken();
      const res = await updateUserPunch(selectedEmployee.id, token, editId, editedPunch);

      if (res.success) {
        setPunches((prev) =>
          prev.map((p) =>
            p.id === editId
              ? {
                  ...p,
                  ...editedPunch,
                  timeIn: addAmPm(editedPunch.timeIn),
                  timeOut: addAmPm(editedPunch.timeOut),
                }
              : p
          )
        );
        showToast("success", "Punch updated successfully!");
      } else {
        showToast("error", "Update failed.");
      }

      setEditId(null);
    } catch (err) {
      showToast("error", "Something went wrong.");
    }
  };

  return {
    loading,
    punches,
    editId,
    editedPunch,
    toast,
    handleEdit,
    handleInputChange,
    handleTimeInputChange,
    handleSave,
    setEditId,
  };
};
