import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';


  export const register = async ( name, email, password ) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(user, { displayName: name });
      }

      const token = await user.getIdToken();
      const userData = { name, email };

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
          headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        return { success: false };
      }
      const { data } = await response.json();

      return { success: true, data };
    } catch (error) {
      return { success: false };
    }
  };

  export const login = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const token = await user.getIdToken();

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
          headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": 'application/json'
        },
      });
      
      if (!response.ok) {
        return { success: false, error: response.error };
      }
      const { role } = await response.json();

      return { success: true, role };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  export const me = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return { success: false, data: null };
      }
      const { data } = await response.json();

      return { success: true, data };
    } catch (error) {
      return { success: false };
    }
  };

  export const logout = async () => {
    try {
      const outSuccess = await signOut(auth);
      if (outSuccess) navigate("/");

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };