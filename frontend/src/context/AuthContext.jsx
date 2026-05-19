import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 penting

  // 🔥 LOAD USER DARI LOCAL STORAGE
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.log("Error parsing user:", err);
        localStorage.removeItem("user");
      }
    }

    setLoading(false); // 🔥 selesai loading
  }, []);

  // 🔥 LOGIN
  const login = (dataUser) => {
    const fixedUser = {
      ...dataUser,
      role: dataUser.role?.toLowerCase() || "pengawas"
    };

    localStorage.setItem("user", JSON.stringify(fixedUser));
    setUser(fixedUser);
  };

  // 🔥 LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser, 
        login, 
        logout, 
        loading // 🔥 WAJIB dipakai di page
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);