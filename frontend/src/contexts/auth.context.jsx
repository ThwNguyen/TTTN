import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me', {
        withCredentials: true,
      });
      setCurrentUser(res.data);
    } catch (err) {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    fetchProfile(); // Kiểm tra xem có người dùng nào đang đăng nhập không
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
