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

interface ClinicianProps {
  name: string;
  surname: string;
  gender: string;
  occupation: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export default function EditProfile() {
  const router = useRouter();

  const { clinicianId } = useAuth(); // Recupera o ID do clínico do contexto
  const [clinician, setClinician] = useState<ClinicianProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar os dados do clínico
  const fetchClinicianData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const response = await api.get(`/clinicians/by-id/${clinicianId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data || !response.data.clinician) {
        throw new Error("Dados do clínico não encontrados");
      }

      const clinicianData = response.data.clinician;
      setClinician(clinicianData);
    } catch (error) {
      console.error('Erro ao buscar clínico:', error);
      setError('Erro ao carregar os dados do clínico.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (clinician) {
      const dataToSend = {
        ...clinician,
        name: clinician.name || '', // Garante que não esteja null
        surname: clinician.surname || '', // Garante que não esteja null
        occupation: clinician.occupation || '', // Garante que não esteja null
        // Adicione outros campos obrigatórios, se necessário
      };

      try {
        const token = localStorage.getItem("access_token");
        console.log('Prontuário a ser salvo:', dataToSend); // Para depuração
        await api.put(`/clinicians/${clinicianId}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Atualiza o email no localStorage se o email for alterado
        if (clinician.email) {
          localStorage.setItem("user_email", clinician.email);
        }

        alert("Prontuário salvo com sucesso!");
        router.push('/Medico/Pacientes');
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
    if (clinicianId) {
      fetchClinicianData();
    } else {
      setError("ID do clínico não está disponível.");
      setLoading(false);
    }
  }, [clinicianId]);

  // Exibição de estado de carregamento
  if (loading) return <div>Carregando...</div>;

  // Exibição do formulário para edição do perfil
  return (
    <PrivateRoute requiredUserType='clinician'>
      <div className="h-screen p-8 pb-20 sm:p-20 bg-gray-100 mx-auto overflow-y-auto">
        <NavbarDoctor />
        <h2 className="font-bold text-4xl text-gray-700 pt-6 pb-4 mb-6">Editar Perfil do Clínico</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {clinician ? (
          <div className="grid gap-8 pb-8">
            <Input
              label="Nome"
              type="text"
              value={clinician.name || ''}
              onChange={(e) => setClinician({ ...clinician, name: e.target.value })}
            />
            <Input
              label="Sobrenome"
              type="text"
              value={clinician.surname || ''}
              onChange={(e) => setClinician({ ...clinician, surname: e.target.value })}
            />
            <Input
              label="Especialização"
              type="text"
              value={clinician.occupation || ''}
              onChange={(e) => setClinician({ ...clinician, occupation: e.target.value })}
            />
            <div>
              <label className="text-lg block text-gray-700 font-medium mb-2">Gênero</label>
              <select
                value={clinician.gender || ''}
                onChange={(e) => setClinician({ ...clinician, gender: e.target.value })}
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
              value={clinician.phoneNumber || ''}
              onChange={(e) => setClinician({ ...clinician, phoneNumber: e.target.value })}
              placeholder="Número de Telefone"
            />

            <Input
              label="Email"
              type="email"
              value={clinician.email || ''}
              onChange={(e) => setClinician({ ...clinician, email: e.target.value })}
              placeholder="Email"
            />

            <Input
              label="Senha"
              type="text"
              value={clinician.password || ''}
              onChange={(e) => setClinician({ ...clinician, password: e.target.value })}
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
