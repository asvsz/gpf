'use client'
import ButtonOne from '@/app/components/ButtonOne';
import LogoutButton from '@/app/components/LogoutButton';
import Modal from '@/app/components/Modal';
import { useAuth } from '@/app/context/AuthContext';
import api from '@/app/services/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ClinicianProps {
  id: string;
  name?: string;
  surname?: string;
  gender?: string;
  occupation?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
}

export default function Perfil({}: ClinicianProps ) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clinician, setClinician] = useState<ClinicianProps | null>(null);
  const [clinicians, setClinicians] = useState<ClinicianProps[]>([]);
  const [loading, setLoading] = useState(true);

  const { setClinicianId } = useAuth()
  const router = useRouter()

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditButton = () => {
    if (clinician) {
      setClinicianId(clinician.id)
      router.push('/Medico/Perfil/Editar')
    } else {
      console.error('Clinician não definido');
    }
  }

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
    <div className="flex items-center justify-center ">
      {clinician ? (
        <>
          <button
            className="px-4 text-white rounded-lg"
            onClick={handleOpenModal}
          >
            {clinician.name} {clinician.surname}
          </button>

          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <div className='flex flex-col gap-4 pb-4'>
              <h3 className="text-2xl block text-gray-700 font-medium pb-6">Perfil do Fisioterapeuta</h3>
              <p
                className='flex gap-2'><h3 className='font-semibold'>Nome: </h3>{clinician.name} {clinician.surname}
              </p>
              <p className='flex gap-2'><h3 className='font-semibold'>Email:</h3> {clinician.email}</p>
              <p className='flex gap-2'><h3 className='font-semibold'>Genero:</h3>{clinician.gender}</p>
              <p className='flex gap-2'><h3 className='font-semibold'>Especialização: </h3>{clinician.occupation}</p>
            <p className='flex gap-2'><h3 className='font-semibold'>Número de Telefone: </h3>{clinician.phoneNumber}</p>
            </div>
            <div className="flex gap-4 ">
              <ButtonOne
                  texto='Editar'
                  type='button'
                  onClick={handleEditButton} />
              <LogoutButton/>
            </div>

          </Modal>
        </>
      ) : (
        <p>...</p>
      )}
    </div>
  );
}
