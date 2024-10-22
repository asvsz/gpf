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
  const { prontuarioId} = useAuth(); // Obtenha o ID do prontuário e clinicianId do contexto
  const prontuario = useFetchProntuario(prontuarioId); // Use o hook customizado para buscar o prontuário
  const paciente = useFetchPaciente(prontuario?.patientId ?? null); // Use o hook customizado para buscar o paciente

  const editRoute = '/Medico/Pacientes/Prontuario/Editar'; // Defina a rota de edição

  if (!prontuario) return <div>Carregando...</div>; // Exibir enquanto carrega

  return (
      <PrivateRoute requiredUserType="clinician">
        <div className="gap-8 grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 sm:p-20 font-[var(--font-geist-sans)]">
          <NavbarDoctor />
          <main className="flex row-start-2 items-center sm:items-start z-0">
            <div className="flex flex-col gap-8 pt-10">
              <div className="flex justify-between">
                <EditButton route={editRoute} id={String(prontuarioId)} />
              </div>

              {/* Exibição dos dados do prontuário */}
              <div className="flex flex-col p-4 gap-8">
                <h2 className="text-lg font-bold">Prontuário do Paciente</h2>
                {paciente && (
                    <div className="flex flex-col gap-8">
                      <h2 className="text-lg font-bold">Informações do Paciente</h2>
                      <p><strong>Nome:</strong> {paciente.name} {paciente.surname}</p>
                      <p><strong>CPF:</strong> {paciente.cpf}</p>
                      <p><strong>Gênero:</strong> {paciente.gender}</p>
                      <p><strong>Data de Nascimento:</strong> {paciente.birthDate}</p>
                      <p><strong>Telefone:</strong> {paciente.phoneNumber}</p>
                      <p><strong>Email:</strong> {paciente.email}</p>
                    </div>
                )}

                <p><strong>Profissão:</strong> {prontuario.profession}</p>
                <p><strong>Contato de Emergência:</strong>
                  <br /><div className="pl-4 pt-4"><strong>Email:</strong> {prontuario.emergencyContactEmail}</div>
                  <br /><div className="pl-4"><strong>Número de Telefone:</strong> {prontuario.emergencyContactNumber}</div>
                </p>
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
          </main>
          <FooterBar />
        </div>
      </PrivateRoute>
  );
}
