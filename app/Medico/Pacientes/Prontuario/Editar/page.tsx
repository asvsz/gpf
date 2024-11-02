'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from "@/app/services/api";
import { useAuth } from '@/app/context/AuthContext';
import SaveButton from '@/app/components/SaveButton';
import CancelButton from '@/app/components/CancelButton';
import axios from 'axios';
import PrivateRoute from '@/app/components/PrivateRoute';
import NavbarDoctor from '@/app/components/NavbarDoctor';
import FooterBar from '@/app/components/Footer';
import Input from '@/app/components/InputText';

interface ProntuarioProps {
  profession: string;
  emergencyContactEmail: string;
  emergencyContactNumber: string;
  allergies: string[];
  maritalStatus: string;
  height: number; // em centímetros
  weight: number; // em quilogramas
  medicationsInUse: string[]; // Lista de medicamentos em uso
  diagnosis: string[]; // Lista de diagnósticos
}

export default function EditMedicalRecord() {
  const router = useRouter();
  const { prontuarioId } = useAuth();
  const [prontuario, setProntuario] = useState<ProntuarioProps | null>(null);
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
        profession: prontuario.profession || '',
        emergencyContactEmail: prontuario.emergencyContactEmail || '',
        allergies: prontuario.allergies || '',
      };

      try {
        const token = localStorage.getItem("access_token");
        console.log('Prontuário a ser salvo:', dataToSend);
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

  return (
    <PrivateRoute requiredUserType='clinician'>
      <div className="flex flex-col min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <NavbarDoctor />
        <h2 className="text-4xl font-bold text-gray-700  pt-8">Editar Prontuário</h2>
        {loading && <div className="text-lg text-gray-500">Carregando...</div>} {/* Carregando dentro da página */}
        {error && <div className="text-red-500">{error}</div>}
        {prontuario ? (
          <div className="flex flex-col gap-4 pb-8">
            <Input
              label='Profissão'
              type="text"
              value={prontuario.profession || ''}
              onChange={(e) => setProntuario({ ...prontuario, profession: e.target.value })}
              placeholder="Profissão"
            />
            <Input
              label='Email de Contato de Emergência'
              type="text"
              value={prontuario.emergencyContactEmail || ''}
              onChange={(e) => setProntuario({ ...prontuario, emergencyContactEmail: e.target.value })}
              placeholder="Email de Contato de Emergência"
            />
            <Input
              label='Número de Contato de Emergência'
              type="text"
              value={prontuario.emergencyContactNumber || ''}
              onChange={(e) => setProntuario({ ...prontuario, emergencyContactNumber: e.target.value })}
              placeholder="Número de Contato de Emergência"
            />
            <Input
              label='Alergias'
              type="text"
              value={prontuario.allergies.join(',') || ''}
              onChange={(e) => setProntuario({ ...prontuario, allergies: e.target.value.split(',').map(diag => diag.trim()) })}
              placeholder="Alergias"
            />
            <div>
              <label className="block text-gray-700">Estado Civil</label>
              <select
                value={prontuario.maritalStatus || ''}
                onChange={(e) => setProntuario({ ...prontuario, maritalStatus: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="" disabled>
                  Selecione
                </option>
                <option value="single">Solteiro(a)</option>
                <option value="married">Casado(a)</option>
                <option value="divorced">Divociado(a)</option>
                <option value="widowed">Viúvo(a)</option>
              </select>
            </div>
            <Input
              label="Altura (cm)"
              type="number"
              value={prontuario.height || ''}
              onChange={(e) => setProntuario({ ...prontuario, height: Number(e.target.value) })}
              placeholder="Altura (cm)"
            />
            <Input
              label="Peso (kg)"
              type="number"
              value={prontuario.weight || ''}
              onChange={(e) => setProntuario({ ...prontuario, weight: Number(e.target.value) })}
              placeholder="Peso (kg)"
            />
            <textarea
              value={prontuario.medicationsInUse.join(',') || ''}
              onChange={(e) => setProntuario({ ...prontuario, medicationsInUse: e.target.value.split(',').map(med => med.trim()) })}
              className="border rounded-md px-2 py-1"
              placeholder="Medicações em Uso (separe por vírgulas)"
            />
            <textarea
              value={prontuario.diagnosis.join(',') || ''}
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
        <FooterBar />
      </div>
    </PrivateRoute>
  );
}
