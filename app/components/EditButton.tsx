import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface EditButtonProps {
  route: string;
  id: string;
}

export default function EditButton({route, id }: EditButtonProps) {
  const router = useRouter();
  const { setProntuarioId } = useAuth();

  // Função para lidar com o clique no botão
  const handleEdit = () => {
    setProntuarioId(id)
    router.push(`${route}`);  // Redireciona para a página de edição
  };

  return (
    <button
      onClick={handleEdit}
      className="bg-custom-green text-white px-4 py-2 rounded-md"
    >
      Editar
    </button>
  );
};

