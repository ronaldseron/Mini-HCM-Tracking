import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { me } from "../services/authService";
import AppLoader from "../components/common/AppLoader";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skipMeFetch, setSkipMeFetch] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setUserData(null);
        setLoading(false);
        return;
      }

      if (skipMeFetch) {
        setUser(currentUser);
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        const token = await currentUser.getIdToken();
        const result = await me(token);

        if (result.success) {
          setUser(currentUser);
          setUserData(result.data);
        } else {
          setUser(null);
          setUserData(null);
        }
      } catch (error) {
        setUser(null);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [skipMeFetch]);

  const getUserToken = useCallback(async () => auth.currentUser?.getIdToken() || null, []);

  const withToken = useCallback(
    async (service) => {
      const token = await getUserToken();
      if (!token) throw new Error("No auth token available");
      return service(token);
    },
    [getUserToken]
  );

  if (loading) {
    return <AppLoader />;
  }

  const value = {
    user,
    userData,
    loading,
    isAuthenticated: !!user,
    isAdmin: userData?.role === "admin",
    isEmployee: userData?.role === "employee",
    getUserToken,
    withToken,
    setSkipMeFetch, // Expose control for registration flow
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
