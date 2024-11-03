'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import ButtonOne from './ButtonOne';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredUserType: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredUserType }) => {
  const { user } = useAuth(); 
  const router = useRouter();
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (!user) {
      setAccessDenied(true); 
    } else if (user !== requiredUserType) {
      setAccessDenied(true); 
    }
  }, [user, requiredUserType]);

  const handleBack = () => {
    router.back(); 
  };

  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h2 className="text-xl mb-4">Você não tem autorização para acessar esta página.
          <br />Clique no botão abaixo para voltar a sua tela anterior.
        </h2>
        <ButtonOne
          texto="Voltar"
          onClick={handleBack}
        />
      </div>
    );
  }

  return <>{children}</>; 
};

export default PrivateRoute;
