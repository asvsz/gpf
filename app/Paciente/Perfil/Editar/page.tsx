'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from "@/app/services/api";
import { useAuth } from '@/app/context/AuthContext';
import SaveButton from '@/app/components/SaveButton';
import CancelButton from '@/app/components/CancelButton';
import axios from 'axios';
import PrivateRoute from '@/app/components/PrivateRoute';
import NavbarDoctor from "@/app/components/NavbarDoctor";
import FooterBar from "@/app/components/Footer";
import Input from '@/app/components/InputText';
import NavbarPaciente from '@/app/components/NavbarPaciente';

interface PacienteProps {
  name: string;
  surname: string;
  gender: string;
  birthDate: string;
  cpf: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  email: string;
  password: string;
}

export default function EditProfile() {
  const router = useRouter();

  const { patientId } = useAuth(); // Recupera o ID do clínico do contexto
  const [patient, setPatient] = useState<PacienteProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar os dados do clínico
  const fetchPatientData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const response = await api.get(`/patients/by-id/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data || !response.data.patient) {
        throw new Error("Dados do clínico não encontrados");
      }

      const patientData = response.data.patient;
      setPatient(patientData);
    } catch (error) {
      console.error('Erro ao buscar clínico:', error);
      setError('Erro ao carregar os dados do clínico.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (patient) {
      const dataToSend = {
        ...patient,
        name: patient.name || '', // Garante que não esteja null
        surname: patient.surname || '', // Garante que não esteja null
        occupation: patient.birthDate || '', // Garante que não esteja null
        // Adicione outros campos obrigatórios, se necessário
      };

      try {
        const token = localStorage.getItem("access_token");
        console.log('Prontuário a ser salvo:', dataToSend); // Para depuração
        await api.put(`/patients/${patientId}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Atualiza o email no localStorage se o email for alterado
        if (patient.email) {
          localStorage.setItem("user_email", patient.email);
        }
        router.push('/Paciente/Prontuario');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error('Erro ao salvar prontuário:', error.response.data);
          setError(`Erro ao salvar as alterações: ${error.response.data.message}`);
        } else {
          console.error('Erro ao salvar prontuário:', error);
          setError('Erro ao salvar as alterações.');
        }
      }
    }
  };

  // Carregar os dados quando o componente for montado
  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    } else {
      setError("ID do paciente não está disponível.");
      setLoading(false);
    }
  }, [patientId]);

  // Exibição de estado de carregamento
  if (loading) return <div>Carregando...</div>;

  // Exibição do formulário para edição do perfil
  return (
    <PrivateRoute requiredUserType='patient'>
      <div className="h-screen p-8 pb-20 sm:p-20 bg-gray-100 mx-auto overflow-y-auto">
        <NavbarPaciente />
        <h2 className="font-bold text-4xl text-gray-700 pt-6 pb-4 mb-6">Editar Perfil do Paciente</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {patient ? (
          <div className="grid gap-8 pb-8">
            <Input
              label="Nome"
              type="text"
              value={patient.name || ''}
              onChange={(e) => setPatient({ ...patient, name: e.target.value })}
            />
            <Input
              label="Sobrenome"
              type="text"
              value={patient.surname || ''}
              onChange={(e) => setPatient({ ...patient, surname: e.target.value })}
            />
            <Input
              label="Data de Nascimento"
              type="text"
              value={patient.birthDate || ''}
              onChange={(e) => setPatient({ ...patient, birthDate: e.target.value })}
            />
            <Input
              label="CPF"
              type="text"
              value={patient.cpf || ''}
              onChange={(e) => setPatient({ ...patient, cpf: e.target.value })}
            />
            <div>
              <label className="text-lg block text-gray-700 font-medium mb-2">Gênero</label>
              <select
                value={patient.gender || ''}
                onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="" disabled>Selecione</option>
                <option value="female">Feminino</option>
                <option value="male">Masculino</option>
              </select>
            </div>

            <Input
              label="Número de Telefone"
              type="text"
              value={patient.phoneNumber || ''}
              onChange={(e) => setPatient({ ...patient, phoneNumber: e.target.value })}
              placeholder="Número de Telefone"
            />

            <Input
              label="Endereço"
              type="text"
              value={patient.address || ''}
              onChange={(e) => setPatient({ ...patient, address: e.target.value })}
              placeholder="Endereço"
            />
            <Input
              label="Cidade"
              type="text"
              value={patient.city || ''}
              onChange={(e) => setPatient({ ...patient, city: e.target.value })}
              placeholder="Endereço"
            />
            <Input
              label="Estado"
              type="text"
              value={patient.state || ''}
              onChange={(e) => setPatient({ ...patient, state: e.target.value })}
              placeholder="Endereço"
            />

            <Input
              label="Email"
              type="email"
              value={patient.email || ''}
              onChange={(e) => setPatient({ ...patient, email: e.target.value })}
              placeholder="Email"
            />

            <Input
              label="Senha"
              type="text"
              value={patient.password || ''}
              onChange={(e) => setPatient({ ...patient, password: e.target.value })}
              placeholder="Senha"
            />

            <div className="flex w-full items-baseline justify-end gap-4 mt-4 pr-8">
              <CancelButton onClick={() => router.push('/Medico/Pacientes')} />
              <SaveButton onClick={handleSave} />
            </div>
          </div>
        ) : (
          <div>Perfil do clínico não encontrado.</div>
        )}
        <FooterBar />
      </div>
    </PrivateRoute>
  );
}
