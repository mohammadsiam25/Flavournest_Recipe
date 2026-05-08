import { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  useEffect(() => {
    const savedToken = localStorage.getItem("fn_token");
    const savedUser = localStorage.getItem("fn_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("fn_token", userToken);
    localStorage.setItem("fn_user", JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("fn_token");
    localStorage.removeItem("fn_user");
  };
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
