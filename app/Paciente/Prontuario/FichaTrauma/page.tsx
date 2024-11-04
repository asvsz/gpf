'use client';
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

interface TraumaRecordProps {
  medicalDiagnosis: string;
  anamnesis: string;
  physicalExamination: string;
  triage: string;
  palpation: string;
  edema: boolean;
  pittingTest: boolean;
  fingerPressureTest: boolean;
  perimetry: {
    rightArm: number;
    leftArm: number;
    upperRightThigh: number;
    upperLeftThigh: number;
    lowerRightThigh: number;
    lowerLeftThigh: number;
    rightKnee: number;
    leftKnee: number;
  };
  subjectivePainAssessment: {
    intensity: number;
    location: string;
    characteristic: string;
  };
  specialOrthopedicTest: string;
}

export default function ViewTraumaRecord() {
  const [record, setRecord] = useState<TraumaRecordProps | null>(null);
  const [patient, setPatient] = useState<PatientProps | null>(null);
  const [patients, setPatients] = useState<PatientProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [prontuarioLoading, setProntuarioLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

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
      setError('Erro ao buscar pacientes.');
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

      const response = await api.get(`/trauma-orthopedic-record/by-patient-id/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.record) {
        const mappedProntuario: TraumaRecordProps = response.data.record;
        setRecord(mappedProntuario);
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
          <h2 className="text-4xl font-bold text-gray-700 mb-4">Ficha Trauma Ortopédico</h2>
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
            {record && (
              <div className="grid gap-8 pb-8">
                <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Diagnóstico Médico:</h3>
                  <p>{record.medicalDiagnosis}</p>
                </div>

                <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Anamnese:</h3>
                  <p>{record.anamnesis}</p>
                </div>

                <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Exame Físico:</h3>
                  <p>{record.physicalExamination}</p>
                </div>

                <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Triagem:</h3>
                  <p>{record.triage}</p>
                </div>

                <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Palpação:</h3>
                  <p>{record.palpation}</p>
                </div>

                <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Edema:</h3>
                  <p>{record.edema ? 'Sim' : 'Não'}</p>
                </div>

                <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Teste de Pitting:</h3>
                  <p>{record.pittingTest ? 'Positivo' : 'Negativo'}</p>
                </div>

                <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Teste de Pressão Digital:</h3>
                  <p>{record.fingerPressureTest ? 'Positivo' : 'Negativo'}</p>
                </div>

                <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Perimetria:</h3>
                  <p className='flex gap-2'><h3 className='font-semibold'>Braço Direito: </h3>{record.perimetry.rightArm}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Braço Esquerdo: </h3>{record.perimetry.leftArm}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Parte Superior Coxa Direita: </h3>{record.perimetry.upperRightThigh}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Parte Superior Coxa Esquerda: </h3>{record.perimetry.upperLeftThigh}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Parte Inferior Coxa Direita: </h3>{record.perimetry.lowerRightThigh}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Parte Inferior Coxa Esquerda: </h3>{record.perimetry.lowerLeftThigh}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Joelho Direito: </h3>{record.perimetry.rightKnee}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Joelho Esquerdo: </h3>{record.perimetry.leftKnee}</p>
                </div>

                <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Avaliação Subjetiva da Dor:</h3>
                  <p className='flex gap-2'><h3 className='font-semibold'>Intensidade: </h3>{record.subjectivePainAssessment.intensity}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Localização: </h3>{record.subjectivePainAssessment.location}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Característica: </h3>{record.subjectivePainAssessment.characteristic}</p>
                </div>

                <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Teste Ortopédico Especial:</h3>
                  <p>{record.specialOrthopedicTest}</p>
                </div>
                <div className="flex w-full items-baseline justify-end gap-4 mt-4 pr-8">
                  <ButtonOne
                    texto="Voltar"
                    onClick={() => router.back()} />
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
