// src/components/LogoutButton.tsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const LogoutButton = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // Chama a função de logout
    router.push('/'); // Redireciona para a página de login
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition"
    >
      Sair
    </button>
  );
};

export default LogoutButton;
