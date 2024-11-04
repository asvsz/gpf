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

interface CardioRecordProps {
  medicalDiagnosis: string;
  anamnesis: string;
  physicalExamination: string;
  triage: string;
  lifestyleHabits: {
    alcoholConsumption: boolean;
    smoker: boolean;
    obesity: boolean;
    diabetes: boolean;
    drugUser: boolean;
    physicalActivity: boolean;
  };
  physicalInspection: {
    isFaceSinusPalpationHurtful: boolean;
    nasalSecretion: {
      type: string;
      isFetid: boolean;
      quantity: string;
    };
    nasalItching: string;
    sneezing: string;
    chestType: string;
    respiratoryOrCardiacSigns: string;
  };
  vitalSigns: {
    heartRate: number;
    respiratoryRate: number;
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
    temperature: number;
    oxygenSaturation: number;
  };
  pneumofunctionalAssessment: {
    peakFlow: {
      firstMeasurement: number;
      secondMeasurement: number;
      thirdMeasurement: number;
    };
    manovacuometry: {
      pemax: {
        firstMeasurement: number;
        secondMeasurement: number;
        thirdMeasurement: number;
      };
      pimax: {
        firstMeasurement: number;
        secondMeasurement: number;
        thirdMeasurement: number;
      };
    };
  };
  cardiofunctionalAssessment: {
    bmi: number;
    abdominalPerimeter: number;
    waistHipRatio: number;
    bioimpedance: {
      bodyFat: number;
      visceralFat: number;
      muscleMassPercentage: number;
    };
    adipometry: {
      skinfoldMeasurements: {
        bicipital: number;
        tricipital: number;
        subscapular: number;
        abdominal: number;
      };
    };
  };
}

export default function ViewCardioRecord() {
  const [record, setRecord] = useState<CardioRecordProps | null>(null);
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

      const response = await api.get(`/cardiorespiratory-record/by-patient-id/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.record) {
        const mappedProntuario: CardioRecordProps = response.data.record;
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
          <h2 className="text-4xl font-bold text-gray-700 mb-4">Ficha Cardiorespiratório</h2>
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

                <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Hábitos de Vida:</h3>
                  <p className='flex gap-2'><h3 className='font-semibold'>Consome Álcool:</h3> {record.lifestyleHabits.alcoholConsumption ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Fumante: </h3>{record.lifestyleHabits.smoker ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Obesidade: </h3>{record.lifestyleHabits.obesity ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Diabetes: </h3>{record.lifestyleHabits.diabetes ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Usuário de Drogas: </h3>{record.lifestyleHabits.drugUser ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Atividade Física: </h3>{record.lifestyleHabits.physicalActivity ? 'Sim' : 'Não'}</p>
                </div>

                <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Sinais Vitais:</h3>
                  <p className='flex gap-2'><h3 className='font-semibold'>Frequência Cardíaca: </h3>{record.vitalSigns.heartRate}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Frequência Respiratória: </h3>{record.vitalSigns.respiratoryRate}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Pressão Arterial: </h3>{record.vitalSigns.bloodPressure.systolic}/{record.vitalSigns.bloodPressure.diastolic}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Temperatura: </h3>{record.vitalSigns.temperature}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Saturação de Oxigênio: </h3>{record.vitalSigns.oxygenSaturation}</p>
                </div>

                <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Inspeção Física:</h3>
                  <p className='flex gap-2'><h3 className='font-semibold'>Palpação Facial e Sinusal Dolorosa: </h3>{record.physicalInspection.isFaceSinusPalpationHurtful ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Tipo de Secreção Nasal: </h3>{record.physicalInspection.nasalSecretion.type}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Secreção Nasal Fetida: </h3>{record.physicalInspection.nasalSecretion.isFetid ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Quantidade de Secreção Nasal: </h3>{record.physicalInspection.nasalSecretion.quantity}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Coceira Nasal: </h3>{record.physicalInspection.nasalItching}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Espirros: </h3>{record.physicalInspection.sneezing}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Tipo de Tórax: </h3>{record.physicalInspection.chestType}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Sinais Respiratórios ou Cardíacos: </h3>{record.physicalInspection.respiratoryOrCardiacSigns}</p>
                </div>

                <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Avaliação Pneumofuncional:</h3>
                  <p className='flex gap-2'><h3 className='font-semibold'>Primeira Medição do Fluxo de Pico: </h3>{record.pneumofunctionalAssessment.peakFlow.firstMeasurement}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Segunda Medição do Fluxo de Pico: </h3>{record.pneumofunctionalAssessment.peakFlow.secondMeasurement}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Terceira Medição do Fluxo de Pico: </h3>{record.pneumofunctionalAssessment.peakFlow.thirdMeasurement}</p>
                </div>

                <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Avaliação Cardiofuncional:</h3>
                  <p className='flex gap-2'><h3 className='font-semibold'>IMC: </h3>{record.cardiofunctionalAssessment.bmi}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Perímetro Abdominal: </h3>{record.cardiofunctionalAssessment.abdominalPerimeter}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Relação Cintura-Quadril: </h3>{record.cardiofunctionalAssessment.waistHipRatio}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Gordura Corporal: </h3>{record.cardiofunctionalAssessment.bioimpedance.bodyFat}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Gordura Visceral: </h3>{record.cardiofunctionalAssessment.bioimpedance.visceralFat}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Porcentagem de Massa Muscular: </h3>{record.cardiofunctionalAssessment.bioimpedance.muscleMassPercentage}</p>
                </div>
                <div className="flex w-full items-baseline justify-end gap-4 mt-4 pr-8">
                  <ButtonOne
                    texto='Voltar'
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
