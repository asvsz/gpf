'use client'
import ButtonOne from "@/app/components/ButtonOne";
import FooterBar from "@/app/components/Footer";
import NavbarPaciente from "@/app/components/NavbarPaciente";
import PrivateRoute from "@/app/components/PrivateRoute";

import api from "@/app/services/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

interface Prontuario {
  id: string;
  patientId: string;
  consultationsIds: string[];
  profession: string;
  emergencyContactEmail: string;
  emergencyContactNumber: string;
  cpf: string;
  allergies: string;
  maritalStatus: string;
  height: number;
  weight: number;
  medicationsInUse: string[];
  diagnosis: string[];
  createdAt: string;
  updatedAt: string;
}

export default function Prontuario() {
  const [prontuario, setProntuario] = useState<Prontuario | null>(null);
  const [patient, setPatient] = useState<PatientProps | null>(null);
  const [patients, setPatients] = useState<PatientProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [prontuarioLoading, setProntuarioLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter()

  const fetchPatients = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await api.get('/patients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients(response.data.patients);
    } catch (error) {
      console.error('Erro ao buscar os pacientes:', error);
      setError('Erro ao buscar pacientes.'); // Atualiza o erro para o estado
    } finally {
      setLoading(false);
    }
  };

  const fetchProntuarioPaciente = async (patientId: string) => {
    if (!patientId) return;

    setProntuarioLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      const response = await api.get(`/universal-medical-record/by-patient-id/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.universalMedicalRecord) {
        const mappedProntuario: Prontuario = response.data.universalMedicalRecord;
        setProntuario(mappedProntuario);
      } else {
        throw new Error("Prontuário não encontrado");
      }
    } catch (error) {
      console.error('Erro ao buscar prontuário:', error);
      setError('Erro ao buscar prontuário. Por favor, tente novamente.');
    } finally {
      setProntuarioLoading(false);
    }
  };

  const fetchPatientByEmail = (email: string) => {
    const matchedPatient = patients.find((patient) => patient.email === email);
    if (matchedPatient) {
      setPatient(matchedPatient);
      return matchedPatient.id; // Retorna o ID do paciente correspondente
    } else {
      console.error('Paciente não encontrado para o e-mail:', email);
      setError('Paciente não encontrado para o e-mail informado.');
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Token não encontrado');
      return;
    }
    fetchPatients();
  }, []);

  useEffect(() => {
    if (!loading && patients.length > 0) {
      const email = localStorage.getItem('user_email');
      if (email) {
        const id = fetchPatientByEmail(email);
        if (id) {
          fetchProntuarioPaciente(id); // Passa o ID do paciente aqui
        }
      }
    }
  }, [patients, loading]);

  return (
    <PrivateRoute requiredUserType="patient">
      <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <NavbarPaciente />
        <div className="flex justify-between pt-10 items-center px-8">
          <h2 className="text-4xl font-bold text-gray-700 mb-4">Prontuário do Paciente</h2>
          <div className="flex gap-4">
            <ButtonOne texto="Neurofuncional"
              onClick={() => {
                router.push(`/Paciente/Prontuario/FichaNeuro`);
              }} />
            <ButtonOne texto="Cardiorespiratório"
              onClick={() => {
                router.push(`/Paciente/Prontuario/FichaCardio`);
              }} />
            <ButtonOne texto="Trauma Ortopédico"
              onClick={() => {
                router.push(`/Paciente/Prontuario/FichaTrauma`);
              }} />
         </div>
        </div>

        {(loading || prontuarioLoading) && (
          <div className="flex justify-center items-center h-32 text-lg text-gray-500">
            Carregando...
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-500">Erro ao carregar prontuário: {error}</div>
          </div>
        )}

        {!loading && !prontuarioLoading && !error && (
          <div className="grid gap-8 p-4">
            {patient && (
              <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Dados Pessoais</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <p><strong className="text-gray-600 text-lg font-semibold">Nome:</strong> {patient.name} {patient.surname}</p>
                  <p><strong className="text-gray-600 text-lg font-semibold">CPF:</strong> {patient.cpf}</p>
                  <p><strong className="text-gray-600 text-lg font-semibold">Gênero:</strong> {patient.gender}</p>
                  <p><strong className="text-gray-600 text-lg font-semibold">Data de Nascimento:</strong> {patient.birthDate}</p>
                  <p><strong className="text-gray-600 text-lg font-semibold">Telefone:</strong> {patient.phoneNumber}</p>
                  <p><strong className="text-gray-600 text-lg font-semibold">Email:</strong> {patient.email}</p>
                </div>
              </div>
            )}

            {prontuario && (
              <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Informações Adicionais</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <p><strong className="text-gray-600 text-lg font-semibold">Profissão:</strong> {prontuario.profession}</p>
                  <p><strong className="text-gray-600 text-lg font-semibold">Alergias:</strong> {prontuario.allergies}</p>
                  <p><strong className="text-gray-600 text-lg font-semibold">Estado Civil:</strong> {prontuario.maritalStatus}</p>
                  <p><strong className="text-gray-600 text-lg font-semibold">Altura:</strong> {prontuario.height} cm</p>
                  <p><strong className="text-gray-600 text-lg font-semibold">Peso:</strong> {prontuario.weight} kg</p>
                  <p><strong className="text-gray-600 text-lg font-semibold">Medicamentos em Uso:</strong> {prontuario.medicationsInUse.join(", ")}</p>
                  <p><strong className="text-gray-600 text-lg font-semibold">Diagnósticos:</strong> {prontuario.diagnosis.join(", ")}</p>
                  <p><strong className="text-gray-600 text-lg font-semibold">Data de Criação:</strong> {prontuario.createdAt}</p>
                  <p><strong className="text-gray-600 text-lg font-semibold">Última Atualização:</strong> {prontuario.updatedAt}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <FooterBar />
      </div>
    </PrivateRoute>
  );
}
