'use client';
import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import PrivateRoute from '@/app/components/PrivateRoute';
import NavbarDoctor from '@/app/components/NavbarDoctor';
import FooterBar from '@/app/components/Footer';
import EditButton from '@/app/components/EditButton';
import { useFetchProntuario } from '@/app/hooks/useFetchProntuario';
import { useFetchPaciente } from '@/app/hooks/useFetchPaciente';

export default function ProntuarioPage() {
  const { prontuarioId } = useAuth(); // Obtenha o ID do prontuário e clinicianId do contexto
  const prontuario = useFetchProntuario(prontuarioId); // Use o hook customizado para buscar o prontuário
  const paciente = useFetchPaciente(prontuario?.patientId ?? null); // Use o hook customizado para buscar o paciente

  const editRoute = '/Medico/Pacientes/Prontuario/Editar'; // Defina a rota de edição

  return (
    <PrivateRoute requiredUserType="clinician">
      <div className="gap-8 grid grid-rows-[auto_1fr_auto] min-h-screen p-8 pb-20 sm:p-20 font-[var(--font-geist-sans)]">
        <NavbarDoctor />

        <div className="flex justify-between pt-10 items-center px-8">
          <h2 className="text-4xl font-bold text-gray-700 mb-4">Prontuário do Paciente</h2>
          <EditButton route={editRoute} id={String(prontuarioId)} />
        </div>

        <div className="grid  gap-8 p-4">
          {(!prontuario || !paciente) ? (
            <div className="flex justify-center text-lg text-gray-500 items-center h-64">Carregando...</div>
          ) : (
            <>
              {paciente && (
                <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-4">Dados Pessoais</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <p>
                        <strong className=' text-gray-600 text-lg font-semibold'>Nome: </strong>
                        <span className="font-sans">{paciente.name} {paciente.surname}</span>
                      </p>
                      <p>
                        <strong className='text-gray-600 font-semibold '>CPF: </strong>
                        <span className="font-sans">{paciente.cpf}</span>
                      </p>
                      <p>
                        <strong className='text-gray-600 font-semibold'>Gênero: </strong>
                        <span className="font-light">{paciente.gender}</span>
                      </p>
                      <p>
                        <strong className='text-gray-600 font-semibold'>Data de Nascimento: </strong>
                        <span className="font-sans">{paciente.birthDate}</span>
                      </p>
                      <p>
                        <strong className='text-gray-600 font-semibold'>Telefone: </strong>
                        <span className="font-sans">{paciente.phoneNumber}</span>
                      </p>
                      <p>
                        <strong className='text-gray-600 font-semibold'>Email: </strong>
                        <span className="font-sans">{paciente.email}</span>
                      </p>
                    </div>

                </div>
              )}

              <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Informações Adicionais</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <p><strong>Profissão:</strong> {prontuario.profession}</p>
                  <p><strong>Alergias:</strong> {prontuario.allergies}</p>
                  <p><strong>Estado Civil:</strong> {prontuario.maritalStatus}</p>
                  <p><strong>Altura:</strong> {prontuario.height} cm</p>
                  <p><strong>Peso:</strong> {prontuario.weight} kg</p>
                  <p><strong>Medicamentos em Uso:</strong> {prontuario.medicationsInUse.join(", ")}</p>
                  <p><strong>Diagnósticos:</strong> {prontuario.diagnosis.join(", ")}</p>
                  <p><strong>Data de Criação:</strong> {prontuario.createdAt}</p>
                  <p><strong>Última Atualização:</strong> {prontuario.updatedAt}</p>
                </div>
              </div>
            </>
          )}
        </div>

        <FooterBar />
      </div>



    </PrivateRoute>
  );
}
