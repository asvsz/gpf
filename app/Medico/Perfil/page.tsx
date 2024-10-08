import Modal from '@/app/components/Modal';
import api from '@/app/services/api';
import { useEffect, useState } from 'react';

interface Clinician {
  id: string;
  name: string;
  surname: string;
  email: string;
}

export default function Perfil() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clinician, setClinician] = useState<Clinician | null>(null);
  const [clinicians, setClinicians] = useState<Clinician[]>([]);
  const [loading, setLoading] = useState(true);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Função para buscar todos os clínicos
  const fetchClinicians = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await api.get('/clinicians', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setClinicians(response.data.clinicians);
    } catch (error) {
      console.error('Erro ao buscar os clínicos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar o clínico com base no e-mail
  const fetchClinicianByEmail = (email: string) => {
    const matchedClinician = clinicians.find((clinician) => clinician.email === email);
    if (matchedClinician) {
      setClinician(matchedClinician);
    } else {
      console.error('Clinician não encontrado para o e-mail:', email);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Token não encontrado');
      return;
    }

    // Extraímos o e-mail armazenado no localStorage
    const email = localStorage.getItem('user_email');
    if (!email) {
      console.error('E-mail do usuário não encontrado');
      return;
    }

    // Buscar todos os clínicos
    fetchClinicians();
  }, []);

  // Após carregar os clínicos, buscamos pelo e-mail
  useEffect(() => {
    if (!loading && clinicians.length > 0) {
      const email = localStorage.getItem('user_email');  // Extraímos o e-mail armazenado

      if (email) {
        fetchClinicianByEmail(email);
      }
    }
  }, [clinicians, loading]);

  return (
    <div className="flex items-center justify-center">
      {clinician ? (
        <>
          <button
            className="px-4 text-white rounded-lg"
            onClick={handleOpenModal}
          >
            {clinician.name} {clinician.surname}
          </button>

          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <h2 className="text-xl font-bold mb-4 text-black">Perfil do Fisioterapeuta</h2>
            <p>
              Nome: {clinician.name} {clinician.surname}
            </p>
            <p>Email: {clinician.email}</p>
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
              onClick={handleCloseModal}
            >
              Fechar Modal
            </button>
          </Modal>
        </>
      ) : (
        <p>Carregando informações do usuário...</p>
      )}
    </div>
  );
}
