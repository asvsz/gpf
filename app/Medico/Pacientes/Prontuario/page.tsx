'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from "@/app/services/api";
import PrivateRoute from '@/app/components/PrivateRoute';
import NavbarDoctor from '@/app/components/NavbarDoctor';
import FooterBar from '@/app/components/Footer';
import EditButton from '@/app/components/EditButton';

interface Prontuario {
  id: string; // ID do registro médico universal
  patientId: string; // ID do paciente
  consultationsIds: string[]; // IDs das consultas associadas
  profession: string; // Profissão do paciente
  emergencyContactEmail: string; // E-mail do contato de emergência
  emergencyContactNumber: string; // Número de telefone do contato de emergência
  cpf: string; // CPF do paciente
  allergies: string; // Alergias do paciente
  maritalStatus: string; // Estado civil do paciente
  height: number; // Altura do paciente em centímetros
  weight: number; // Peso do paciente em quilos
  medicationsInUse: string[]; // Lista de medicamentos em uso
  diagnosis: string[]; // Lista de diagnósticos
  createdAt: string; // Data de criação do registro
  updatedAt: string; // Data de atualização do registro
}

interface Paciente {
  id: string;
  name: string;
  surname: string;
  cpf: string;
  gender: string;
  birthDate: string;
  phoneNumber: string;
  email: string;

}

export default function ProntuarioPage (){
  const { prontuarioId } = useAuth(); // Obtenha o ID do prontuário do contexto
  const [prontuario, setProntuario] = useState<Prontuario | null>(null); // Inicialize como null
  const [paciente, setPaciente] = useState<Paciente | null>(null); // Inicialize como null

  const editRoute = '/Medico/Pacientes/Prontuario/Editar'


  useEffect(() => {
    if (prontuarioId) {
      const fetchProntuario = async () => {
        try {
          const token = localStorage.getItem("access_token");

          const response = await api.get(`/universal-medical-record/${prontuarioId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          console.log("Resposta da API:", response.data); // Verifique a estrutura da resposta

          // Verifique se o prontuário existe na resposta
          if (!response.data.universalMedicalRecord) {
            throw new Error("Prontuário não encontrado na resposta da API");
          }

          // Mapeando o prontuário recebido
          const mappedProntuario: Prontuario = {
            id: response.data.universalMedicalRecord.id,
            patientId: response.data.universalMedicalRecord.patientId,
            consultationsIds: response.data.universalMedicalRecord.consultationsIds,
            profession: response.data.universalMedicalRecord.profession,
            emergencyContactEmail: response.data.universalMedicalRecord.emergencyContactEmail,
            emergencyContactNumber: response.data.universalMedicalRecord.emergencyContactNumber,
            cpf: response.data.universalMedicalRecord.cpf,
            allergies: response.data.universalMedicalRecord.allergies,
            maritalStatus: response.data.universalMedicalRecord.maritalStatus,
            height: response.data.universalMedicalRecord.height,
            weight: response.data.universalMedicalRecord.weight,
            medicationsInUse: response.data.universalMedicalRecord.medicationsInUse,
            diagnosis: response.data.universalMedicalRecord.diagnosis,
            createdAt: response.data.universalMedicalRecord.createdAt,
            updatedAt: response.data.universalMedicalRecord.updatedAt,
          };

          setProntuario(mappedProntuario);
        } catch (error) {
          console.error('Erro ao buscar prontuário:', error);
        }
      };

      fetchProntuario();
    }
  }, [prontuarioId]);



  // Fetch consultations based on consultationsIds from prontuario
  useEffect(() => {
    const fetchPaciente = async () => {
      if (prontuario && prontuario.patientId) {
        try {
          const token = localStorage.getItem("access_token")
          const response = await api.get(`/patients/by-id/${prontuario.patientId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          console.log("Resposta do Paciente:", response.data);

          const mappedPaciente: Paciente = {
            id: response.data.patient.id,
            name: response.data.patient.name,
            surname: response.data.patient.surname,
            cpf: response.data.patient.cpf,
            gender: response.data.patient.gender,
            birthDate: response.data.patient.birthDate,
            phoneNumber: response.data.patient.phoneNumber,
            email: response.data.patient.email,
          };

          setPaciente(mappedPaciente);
        } catch (error) {
          console.error('Erro ao buscar paciente:', error);
        }

      };
    }
    fetchPaciente();
  }, [prontuario]);

  if (!prontuario) return <div>Carregando...</div>; // Aguarde o carregamento do prontuário

  return (
    <PrivateRoute requiredUserType="clinician">
      <div className="gap-8 grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 sm:p-20 font-[var(--font-geist-sans)">
        <NavbarDoctor />
        <main className="flex row-start-2 items-center sm:items-start z-0">
          <div className="flex flex-col gap-8 pt-10">
            <EditButton route={editRoute} id={String(prontuarioId)} />
            {/* Exibir informações do prontuário */}
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
              <p><strong>Contato de Emergência:</strong> {prontuario.emergencyContactEmail}, {prontuario.emergencyContactNumber}</p>
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
};

