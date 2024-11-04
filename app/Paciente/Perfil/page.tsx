'use client'
import ButtonOne from '@/app/components/ButtonOne';
import LogoutButton from '@/app/components/LogoutButton';
import Modal from '@/app/components/Modal';
import { useAuth } from '@/app/context/AuthContext';
import api from '@/app/services/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PatientProps {
  id: string;
  name?: string;
  surname?: string;
  cpf?: string;
  gender?: string;
  birthDate?: string;
  phoneNumber?: string;
  email?: string;
}

export default function PerfilPaciente({}: PatientProps ) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patient, setPatient] = useState<PatientProps | null>(null);
  const [patients, setPatients] = useState<PatientProps[]>([]);
  const [loading, setLoading] = useState(true);

  const { setPatientId } = useAuth()
  const router = useRouter()

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditButton = () => {
    if (patient) {
      setPatientId(patient.id)
      router.push('/Paciente/Perfil/Editar')
    } else {
      console.error('Paciente não definido');
    }
  }

  // Função para buscar todos os pacientes
  const fetchClinicians = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await api.get('/patients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPatients(response.data.patients);
    } catch (error) {
      console.error('Erro ao buscar os clínicos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar o paciente com base no e-mail
  const fetchPatientByEmail = (email: string) => {
    const matchedPatient = patients.find((patient) => patient.email === email);
    if (matchedPatient) {
      setPatient(matchedPatient);
    } else {
      console.error('Paciente não encontrado para o e-mail:', email);
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
    if (!loading && patients.length > 0) {
      const email = localStorage.getItem('user_email');  // Extraímos o e-mail armazenado

      if (email) {
        fetchPatientByEmail(email);
      }
    }
  }, [patients, loading]);

  return (
    <div className="flex items-center justify-center ">
      {patient ? (
        <>
          <button
            className="px-4 text-white rounded-lg"
            onClick={handleOpenModal}
          >
            {patient.name} {patient.surname}
          </button>

          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <div className='flex flex-col gap-4 pb-4'>
              <h3 className="text-2xl block text-gray-700 font-medium pb-6">Perfil do Fisioterapeuta</h3>
              <p
                className='flex gap-2'><h3 className='font-semibold'>Nome: </h3>{patient.name} {patient.surname}
              </p>
              <p className='flex gap-2'><h3 className='font-semibold'>Email:</h3> {patient.email}</p>
              <p className='flex gap-2'><h3 className='font-semibold'>Genero:</h3>{patient.gender}</p>
              <p className='flex gap-2'><h3 className='font-semibold'>CPF: </h3>{patient.cpf}</p>
            <p className='flex gap-2'><h3 className='font-semibold'>Número de Telefone: </h3>{patient.phoneNumber}</p>
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
