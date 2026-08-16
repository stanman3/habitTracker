import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('hl_token'));

  useEffect(() => {
    if (token) localStorage.setItem('hl_token', token);
    else localStorage.removeItem('hl_token');
  }, [token]);

  const login = (t) => setToken(t);
  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
