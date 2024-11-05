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

interface NeurofunctionalRecordProps {
  id: string;
  medicalDiagnosis: string;
  anamnesis: string;
  physicalExamination: string;
  physiotherapyDepartment: string;
  triage: string;
  lifestyleHabits: {
    alcoholConsumption: boolean;
    smoker: boolean;
    obesity: boolean;
    diabetes: boolean;
    drugUser: boolean;
    physicalActivity: boolean;
  };
  vitalSigns: {
    bloodPressure: number;
    heartRate: number;
    respiratoryRate: number;
    oxygenSaturation: number;
    bodyTemperature: number;
  };
  physicalInspection: {
    independentMobility: boolean;
    usesCrutches: boolean;
    usesWalker: boolean;
    wheelchairUser: boolean;
    hasScar: boolean;
    hasBedsore: boolean;
    cooperative: boolean;
    nonCooperative: boolean;
    hydrated: boolean;
    hasHematoma: boolean;
    hasEdema: boolean;
    hasDeformity: boolean;
  };
  sensoryAssessment: {
    superficial: string;
    deep: string;
    combinedSensations: {
      graphesthesia: boolean;
      barognosis: boolean;
      stereognosis: boolean;
    };
  };
  patientMobility: {
    threeMeterWalkTimeInSeconds: number;
    hasFallRisk: boolean;
    postureChanges: {
      bridge: string;
      semiRollRight: string;
      semiRollLeft: string;
      fullRoll: string;
      drag: string;
      proneToForearmSupport: string;
      forearmSupportToAllFours: string;
      allFours: string;
      allFoursToKneeling: string;
      kneelingToHalfKneelingRight: string;
      kneelingToHalfKneelingLeft: string;
      halfKneelingRightToStanding: string;
      halfKneelingLeftToStanding: string;
    };
  };
  physiotherapyAssessment: {
    diagnosis: string;
    treatmentGoals: string;
    physiotherapeuticConduct: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function Prontuario() {
  const [record, setRecord] = useState<NeurofunctionalRecordProps | null>(null);
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

      const response = await api.get(`/neurofunctional-record/by-patient-id/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.record) {
        const mappedProntuario: NeurofunctionalRecordProps = response.data.record;
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
          <h2 className="text-4xl font-bold text-gray-700 mb-4">Ficha Neurofuncional</h2>
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

                <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Triagem:</h3>
                  <p>{record.triage}</p>
                </div>

                <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Hábitos de Vida:</h3>
                  <p className='flex gap-2'><h3 className='font-semibold'>Consome Álcool:</h3> {record.lifestyleHabits.alcoholConsumption ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Fumante:</h3> {record.lifestyleHabits.smoker ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Obesidade:</h3> {record.lifestyleHabits.obesity ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Diabetes:</h3> {record.lifestyleHabits.diabetes ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Usuário de Drogas:</h3> {record.lifestyleHabits.drugUser ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Atividades Fisícas:</h3> {record.lifestyleHabits.physicalActivity ? 'Sim' : 'Não'}</p>
                </div>

                <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Sinais Vitais:</h3>
                  <p className='flex gap-2'><h3 className='font-semibold'>Pressão Arterial: </h3>{record.vitalSigns.bloodPressure}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Frequência Cardíaca:</h3> {record.vitalSigns.heartRate}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Frequência Respiratória:</h3> {record.vitalSigns.respiratoryRate}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Saturação do Oxigênio:</h3> {record.vitalSigns.oxygenSaturation}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Temperatura Corporal:</h3> {record.vitalSigns.bodyTemperature}</p>
                </div>

                <div className="flex flex-col bg-gray-100 gap-4 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Inspeção Física:</h3>
                  <p className='flex gap-2'><h3 className='font-semibold'>Mobilidade Independente:</h3> {record.physicalInspection.independentMobility ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Usa Moletas:</h3> {record.physicalInspection.usesCrutches ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Usa Andador:</h3> {record.physicalInspection.usesWalker ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Usa Cadeira de Rodas:</h3> {record.physicalInspection.wheelchairUser ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Tem Cicatriz:</h3> {record.physicalInspection.hasScar ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Tem Escara:</h3> {record.physicalInspection.hasBedsore ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Cooperativo:</h3> {record.physicalInspection.cooperative ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Não Cooperativo:</h3> {record.physicalInspection.nonCooperative ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Hidratado:</h3> {record.physicalInspection.hydrated ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Tem Hematoma:</h3> {record.physicalInspection.hasHematoma ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Tem Edema:</h3> {record.physicalInspection.hasEdema ? 'Sim' : 'Não'}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Tem Deformidade:</h3> {record.physicalInspection.hasDeformity ? 'Sim' : 'Não'}</p>
                </div>

                <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Avaliação Sensória:</h3>
                  <p className='flex gap-2'><h3 className='font-semibold'>Superficial:</h3> {record.sensoryAssessment.superficial}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Profunda:</h3> {record.sensoryAssessment.deep}</p>
                  <h3 className="text-lg block text-gray-700 font-medium pb-2">Combinação de Sensações:</h3>
                  <p className='flex gap-2'><h3 className='font-semibold'>Grafestesia:</h3> {record.sensoryAssessment.combinedSensations.graphesthesia}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Barognose:</h3> {record.sensoryAssessment.combinedSensations.barognosis}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Estereognose:</h3> {record.sensoryAssessment.combinedSensations.stereognosis}</p>
                </div>

                <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Mobilidade do Paciente:</h3>
                  <p className='flex gap-2'><h3 className='font-semibold'>Tempo de Caminhada de 3 Metros:</h3> {record.patientMobility.threeMeterWalkTimeInSeconds} s</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Tem Risco de Queda:</h3> {record.patientMobility.hasFallRisk} s</p>
                  <h3 className="text-lg block text-gray-700 font-medium pb-2">Mudanças de Postura:</h3>
                  <p className='flex gap-2'><h3 className='font-semibold'>Ponte:</h3> {record.patientMobility.postureChanges.bridge} s</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Rolar para Direita:</h3> {record.patientMobility.postureChanges.semiRollRight} s</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Rolar para Esquerda:</h3> {record.patientMobility.postureChanges.semiRollLeft} s</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Rolar Completo:</h3> {record.patientMobility.postureChanges.fullRoll} s</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Arrastar:</h3> {record.patientMobility.postureChanges.drag} s</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Prono para Apoio de Antebraço:</h3> {record.patientMobility.postureChanges.proneToForearmSupport} s</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Apoio de Antebraço para Quatro Apoios:</h3> {record.patientMobility.postureChanges.forearmSupportToAllFours} s</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Quatro Apoios:</h3> {record.patientMobility.postureChanges.allFours} s</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Quatro Apoios To Kneeling::</h3> {record.patientMobility.postureChanges.allFoursToKneeling} s</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Ajoelhar para Meio Ajoelhar Direito:</h3> {record.patientMobility.postureChanges.kneelingToHalfKneelingRight} s</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Ajoelhar para Meio Ajoelhar Esquerdo:</h3> {record.patientMobility.postureChanges.kneelingToHalfKneelingLeft} s</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Meio Ajoelhar Direito para Ficar em Pé:</h3> {record.patientMobility.postureChanges.halfKneelingRightToStanding} s</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Meio Ajoelhar Esquerdo para Ficar em Pé:</h3> {record.patientMobility.postureChanges.halfKneelingLeftToStanding} s</p>
                </div>

                <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                  <h3 className="text-2xl block text-gray-700 font-medium pb-6">Avaliação Fisioterapêutica:</h3>
                  <p className='flex gap-2'><h3 className='font-semibold'>Diagnóstico:</h3> {record.physiotherapyAssessment.diagnosis}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Objetivos do Tratamento: </h3>{record.physiotherapyAssessment.treatmentGoals}</p>
                  <p className='flex gap-2'><h3 className='font-semibold'>Conduta Fisioterapêutica: </h3>{record.physiotherapyAssessment.physiotherapeuticConduct}</p>
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
