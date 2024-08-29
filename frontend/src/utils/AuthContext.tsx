// AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axiosInstance from './axiosInstance';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  user:String;
  setUser: React.Dispatch<React.SetStateAction<String>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('mediumAuthToken');
      if(!token){
        console.log("No existing sessions.")
      }
      else{
        fetchUser();
      }
      setIsAuthenticated(!!token);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const fetchUser = async () => {
    try {
      // setIsLoading(true);
      const token = localStorage.getItem('mediumAuthToken');
      if (!token) {
        throw new Error("Authentication token is missing.");
      }

      const response = await axiosInstance.get('/api/v1/user/me', {
        headers: {'Authorization': `Bearer ${token}`}
      });
      const { data } = response;
      setUser(data.id);
      // console.log("Auth context",data);
    }
    catch(error){
      console.error('Error fetching user:', error);
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loading, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};