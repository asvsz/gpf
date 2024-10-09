'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from "@/app/services/api";
import { useAuth } from '@/app/context/AuthContext';
import SaveButton from '@/app/components/SaveButton';
import CancelButton from '@/app/components/CancelButton';
import axios from 'axios';
import PrivateRoute from '@/app/components/PrivateRoute';

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
   const [showPassword, setShowPassword] = useState(false);

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
      console.log('Dados do clínico:', clinicianData);
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
      <div className="p-8">
        <h2 className="text-lg font-bold">Editar Perfil do Clínico</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {clinician ? (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={clinician.name || ''}
              onChange={(e) => setClinician({ ...clinician, name: e.target.value })}
              className="border rounded-md px-2 py-1"
              placeholder="Nome"
            />
            <input
              type="text"
              value={clinician.surname || ''}
              onChange={(e) => setClinician({ ...clinician, surname: e.target.value })}
              className="border rounded-md px-2 py-1"
              placeholder="Sobrenome"
            />
            <input
              type="text"
              value={clinician.occupation || ''}
              onChange={(e) => setClinician({ ...clinician, occupation: e.target.value })}
              className="border rounded-md px-2 py-1"
              placeholder="Especialização"
            />
            <div>
              <label className="block text-gray-700">Gênero</label>
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

            <input
              type="text"
              value={clinician.phoneNumber || ''}
              onChange={(e) => setClinician({ ...clinician, phoneNumber: e.target.value })}
              className="border rounded-md px-2 py-1"
              placeholder="Número de Telefone"
            />

            <input
              type="email"
              value={clinician.email || ''}
              onChange={(e) => setClinician({ ...clinician, email: e.target.value })}
              className="border rounded-md px-2 py-1"
              placeholder="Email"
            />

            <input
              type="text"
              value={clinician.password || ''}
              onChange={(e) => setClinician({ ...clinician, password: e.target.value })}
              className="border rounded-md px-2 py-1"
              placeholder="Senha"
            />

            <div className="flex gap-2 mt-4">
              <SaveButton onClick={handleSave} />
              <CancelButton onClick={() => router.push('/Medico/Pacientes')} />
            </div>
          </div>
        ) : (
          <div>Perfil do clínico não encontrado.</div>
        )}
      </div>
    </PrivateRoute>
  );
}
