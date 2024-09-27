// context/AuthContext.tsx
'use client'; // Garante que o código será executado no lado do cliente

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: string | null;
  login: (userType: string) => void;
  logout: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => { },
  logout: () => { },
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false); // Verifica se o componente foi montado
  const router = useRouter();

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType'); // Carrega o tipo de usuário do localStorage
    if (storedUserType) {
      setUser(storedUserType); // Define o tipo de usuário se existir
    }
    setIsMounted(true); // Indica que o componente foi montado no cliente
  }, []);

  const login = (userType: string) => {
    setUser(userType); // Armazena o tipo de usuário
    localStorage.setItem('userType', userType); // Armazena no localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userType');
    router.push('/');
  };

  if (!isMounted) return null; // Garante que o componente só será renderizado no cliente

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
