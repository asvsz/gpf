'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from "@/app/services/api";
import { useAuth } from '@/app/context/AuthContext';
import SaveButton from '@/app/components/SaveButton';
import CancelButton from '@/app/components/CancelButton';
import axios from 'axios';
import PrivateRoute from '@/app/components/PrivateRoute';


interface Prontuario {
  profession: string;
  emergencyContactEmail: string;
  emergencyContactNumber: string;
  allergies: string;
  maritalStatus: string;
  height: number; // em centímetros
  weight: number; // em quilogramas
  medicationsInUse: string[]; // Lista de medicamentos em uso
  diagnosis: string[]; // Lista de diagnósticos
}


export default function EditPage() {
  const router = useRouter();
  const { prontuarioId } = useAuth();
  const [prontuario, setProntuario] = useState<Prontuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProntuario = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await api.get(`/universal-medical-record/${prontuarioId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.data.universalMedicalRecord) {
        throw new Error("Prontuário não encontrado");
      }

      const prontuarioData = response.data.universalMedicalRecord;
      console.log('Dados do prontuário:', prontuarioData);
      setProntuario(prontuarioData);
    } catch (error) {
      console.error('Erro ao buscar prontuário:', error);
      setError('Erro ao carregar os dados do prontuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (prontuario) {
      const dataToSend = {
        ...prontuario,
        profession: prontuario.profession || '', // Garante que não esteja null
        emergencyContactEmail: prontuario.emergencyContactEmail || '', // Garante que não esteja null
        allergies: prontuario.allergies || '', // Garante que não esteja null
        // Adicione outros campos obrigatórios, se necessário
      };

      try {
        const token = localStorage.getItem("access_token");
        console.log('Prontuário a ser salvo:', dataToSend); // Para depuração
        await api.put(`/universal-medical-record/${prontuarioId}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert("Prontuário salvo com sucesso!");
        router.push('/Medico/Pacientes/Prontuario');
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

  useEffect(() => {
    if (prontuarioId) {
      fetchProntuario();
    } else {
      setError("ID do prontuário não está disponível.");
      setLoading(false);
    }
  }, [prontuarioId]);

  if (loading) return <div>Carregando...</div>;

  return (
    <PrivateRoute requiredUserType='clinician' >
      <div className="p-8">
        <h2 className="text-lg font-bold">Editar Prontuário</h2>
        {error && <div className="text-red-500">{error}</div>}
        {prontuario ? (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={prontuario.profession || ''}
              onChange={(e) => setProntuario({ ...prontuario, profession: e.target.value })}
              className="border rounded-md px-2 py-1"
              placeholder="Profissão"
            />
            <input
              type="text"
              value={prontuario.emergencyContactEmail || ''}
              onChange={(e) => setProntuario({ ...prontuario, emergencyContactEmail: e.target.value })}
              className="border rounded-md px-2 py-1"
              placeholder="Email de Contato de Emergência"
            />
            <input
              type="text"
              value={prontuario.emergencyContactNumber || ''}
              onChange={(e) => setProntuario({ ...prontuario, emergencyContactNumber: e.target.value })}
              className="border rounded-md px-2 py-1"
              placeholder="Número de Contato de Emergência"
            />
            <input
              type="text"
              value={prontuario.allergies || ''}
              onChange={(e) => setProntuario({ ...prontuario, allergies: e.target.value })}
              className="border rounded-md px-2 py-1"
              placeholder="Alergias"
            />
            <input
              type="text"
              value={prontuario.maritalStatus || ''}
              onChange={(e) => setProntuario({ ...prontuario, maritalStatus: e.target.value })}
              className="border rounded-md px-2 py-1"
              placeholder="Estado Civil"
            />
            <input
              type="number"
              value={prontuario.height || ''}
              onChange={(e) => setProntuario({ ...prontuario, height: Number(e.target.value) })}
              className="border rounded-md px-2 py-1"
              placeholder="Altura (cm)"
            />
            <input
              type="number"
              value={prontuario.weight || ''}
              onChange={(e) => setProntuario({ ...prontuario, weight: Number(e.target.value) })}
              className="border rounded-md px-2 py-1"
              placeholder="Peso (kg)"
            />
            <textarea
              value={prontuario.medicationsInUse.join(', ') || ''}
              onChange={(e) => setProntuario({ ...prontuario, medicationsInUse: e.target.value.split(',').map(med => med.trim()) })}
              className="border rounded-md px-2 py-1"
              placeholder="Medicações em Uso (separe por vírgulas)"
            />
            <textarea
              value={prontuario.diagnosis.join(', ') || ''}
              onChange={(e) => setProntuario({ ...prontuario, diagnosis: e.target.value.split(',').map(diag => diag.trim()) })}
              className="border rounded-md px-2 py-1"
              placeholder="Diagnósticos (separe por vírgulas)"
            />
            <div className="flex gap-2 mt-4">
              <SaveButton onClick={handleSave} />
              <CancelButton onClick={() => router.push('/Medico/Pacientes/Prontuario')} />
            </div>
          </div>
        ) : (
          <div>Prontuário não encontrado.</div>
        )}
      </div>
    </PrivateRoute>
  );
}
