// components/PrivateRoute.tsx
'use client'; // Garante que o código será executado no lado do cliente

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use a importação correta para Next.js
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredUserType: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredUserType }) => {
  const { user } = useAuth(); // Pega o tipo de usuário do AuthContext
  const router = useRouter();
  const [accessDenied, setAccessDenied] = useState(false); // Estado para controlar o acesso

  useEffect(() => {
    if (!user) {
      setAccessDenied(true); // Acesso negado se não houver usuário
    } else if (user !== requiredUserType) {
      setAccessDenied(true); // Acesso negado se o tipo de usuário não corresponder
    }
  }, [user, requiredUserType]);

  const handleBack = () => {
    router.back(); // Volta para a página anterior
  };

  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl mb-4">Você não tem autorização para acessar esta página.
          <br />Clique no botão abaixo para voltar a sua tela anterior.
        </h2>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Voltar
        </button>
      </div>
    );
  }

  return <>{children}</>; // Renderiza os filhos se o tipo de usuário corresponder
};

export default PrivateRoute;
