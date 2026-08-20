import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  login as loginService,
  register as registerService,
  getCurrentUser,
  logout as logoutService,
  User,
} from "../services/authService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginService(email, password);

    localStorage.setItem("token", response.data.token);

    setUser(response.data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await registerService(name, email, password);

    localStorage.setItem("token", response.data.token);

    setUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
