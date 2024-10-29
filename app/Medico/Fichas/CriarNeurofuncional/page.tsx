'use client';
import React, { useState, useEffect } from 'react';
import { useFetchPaciente } from '@/app/hooks/useFetchPaciente';
import { useFetchRegistroMedicoUniversal } from '@/app/hooks/useFetchRegistroMedicoUniversal';
import { useClinicians } from '@/app/hooks/useFetchClinico'; // Importe o novo hook
import api from '@/app/services/api';
import NavbarDoctor from "@/app/components/NavbarDoctor";
import Footer from "@/app/components/Footer";
import {useRouter} from "next/navigation";
import ButtonOne from "@/app/components/ButtonOne";

interface Paciente {
    id: string;
    name: string;
    surname: string;
    cpf: string;
}

const CriarNeurofuncional = () => {
    const { clinicianId, fetchClinicianIdByEmail } = useClinicians();
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [cpf, setCpf] = useState('');
    const [patientId, setPatientId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const router = useRouter();

    const [medicalDiagnosis, setMedicalDiagnosis] = useState('');
    const [anamnesis, setAnamnesis] = useState('');
    const [physicalExamination, setPhysicalExamination] = useState('');
    const [triage, setTriage] = useState('blue');

    // Lifestyle Habits
    const [lifestyleHabits, setLifestyleHabits] = useState({
        alcoholConsumption: false,
        smoker: false,
        obesity: false,
        diabetes: false,
        drugUser: false,
        physicalActivity: false,
    });

    // Vital Signs
    const [vitalSigns, setVitalSigns] = useState({
        bloodPressure: 0,
        heartRate: 0,
        respiratoryRate: 0,
        oxygenSaturation: 0,
        bodyTemperature: 0,
    });

    // Physical Inspection
    const [physicalInspection, setPhysicalInspection] = useState({
        independentMobility: false,
        usesCrutches: false,
        usesWalker: false,
        wheelchairUser: false,
        hasScar: false,
        hasBedsore: false,
        cooperative: false,
        nonCooperative: false,
        hydrated: false,
        hasHematoma: false,
        hasEdema: false,
        hasDeformity: false,
    });

    // Sensory Assessment
    const [sensoryAssessment, setSensoryAssessment] = useState({
        superficial: 'Tactile',
        deep: 'PositionSense',
        combinedSensations: {
            graphesthesia: false,
            barognosis: false,
            stereognosis: false,
        },
    });

    // Patient Mobility
    const [patientMobility, setPatientMobility] = useState({
        threeMeterWalkTimeInSeconds: 5,
        hasFallRisk: false,
        postureChanges: {
            bridge: 'Independent',
            semiRollRight: 'Independent',
            semiRollLeft: 'Independent',
            fullRoll: 'Independent',
            drag: 'Independent',
            proneToForearmSupport: 'Independent',
            forearmSupportToAllFours: 'Independent',
            allFours: 'Independent',
            allFoursToKneeling: 'Independent',
            kneelingToHalfKneelingRight: 'Independent',
            kneelingToHalfKneelingLeft: 'Independent',
            halfKneelingRightToStanding: 'Independent',
            halfKneelingLeftToStanding: 'Independent',
        },
    });

    // Physiotherapy Assessment
    const [physiotherapyAssessment, setPhysiotherapyAssessment] = useState({
        diagnosis: '',
        treatmentGoals: '',
        physiotherapeuticConduct: '',
    });

    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await api.get('/patients', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPacientes(response.data.patients);
            } catch (error) {
                console.error('Erro ao buscar pacientes:', error);
                setError('Erro ao buscar pacientes.');
            }
        };

        const fetchClinicianId = async () => {
            const email = localStorage.getItem('email'); // Recupera o e-mail do localStorage
            if (email) {
                await fetchClinicianIdByEmail(email); // Chama a função para buscar clinicianId pelo e-mail
            }
        };

        // Chama as funções de fetch apenas uma vez quando o componente é montado
        fetchClinicianId();
        fetchPacientes();
    }, []); // Use um array vazio para que o efeito seja executado apenas uma vez na montagem


    const paciente = useFetchPaciente(patientId);
    const registroMedico = useFetchRegistroMedicoUniversal(patientId);

    const handleCpfSubmit = () => {
        if (pacientes.length > 0) {
            const matchedPatient = pacientes.find((p) => p.cpf === cpf);
            if (matchedPatient) {
                setPatientId(matchedPatient.id);
            } else {
                alert('Paciente não encontrado!');
            }
        } else {
            console.error('Lista de pacientes está vazia:', pacientes);
            setError('Lista de pacientes não carregada.');
        }
    };

    const handleCreateFicha = async () => {
        if (!patientId || !clinicianId) {
            alert('Paciente ou clínico não encontrado.');
            return;
        }

        const url = `/neurofunctional-record/patient-id/${patientId}/clinician-id/${clinicianId}`;

        const body = {
            medicalDiagnosis: medicalDiagnosis,
            anamnesis: anamnesis,
            physicalExamination: physicalExamination,
            triage: triage,
            lifestyleHabits: lifestyleHabits,
            vitalSigns: vitalSigns,
            physicalInspection: physicalInspection,
            sensoryAssessment: sensoryAssessment,
            patientMobility: patientMobility,
            physiotherapyAssessment: physiotherapyAssessment,
        };

        try {
            const token = localStorage.getItem('access_token'); // Obtenha o token do localStorage

            const response = await api.post(url, body, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                alert('Ficha neurofuncional criada com sucesso!');
                // Resetar os campos do formulário após o sucesso
                router.push('/Medico/Fichas'); // Você pode implementar uma função para redefinir os campos
            } else {
                console.error('Erro ao criar ficha neurofuncional:', response.statusText);
                alert('Erro ao criar ficha neurofuncional.');
            }
        } catch (error) {
            console.error('Erro ao criar ficha neurofuncional:', error);
            alert('Erro ao criar ficha neurofuncional.');
        }
    };



    return (
        <div className="flex flex-col min-h-screen p-8 pb-20 sm:p-20 font-[var(--font-geist-sans)]">
            <NavbarDoctor/>
            <div className="flex flex-col gap-8">
                <h1 className='text-3xl font-bold mb-4'>Criar Ficha Neurofuncional</h1>
                {error && <p style={{color: 'red'}}>{error}</p>}

                {/* Input for Patient CPF */}
                <div>
                    <label className="block mb-2">
                        CPF do Paciente:
                        <input
                            type="text"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            placeholder="Digite o CPF do paciente"
                            className="border rounded w-full py-2 px-3 mt-1"
                        />
                    </label>
                    <ButtonOne
                        texto={'Buscar Paciente'}
                        onClick={handleCpfSubmit}
                    />
                </div>

                {/* Patient Details */}
                {paciente && (
                    <div className="border p-4 rounded bg-gray-100">
                        <h2 className='text-2xl'>Dados do Paciente</h2>
                        <p>Nome: {paciente.name} {paciente.surname}</p>
                        <p>CPF: {paciente.cpf}</p>

                        {registroMedico && (
                            <div className="mt-4">
                                <h3 className='text-xl'>Registro Médico Universal</h3>
                                <p>Profissão: {registroMedico.profession}</p>
                                <p>Email de Contato de Emergência: {registroMedico.emergencyContactEmail}</p>
                                <p>Número de Contato de Emergência: {registroMedico.emergencyContactNumber}</p>
                                <p>Estado Civil: {registroMedico.maritalStatus}</p>
                                <p>Altura: {registroMedico.height} cm</p>
                                <p>Peso: {registroMedico.weight} kg</p>
                                <p>Alergias: {registroMedico.allergies.join(', ')}</p>
                                <p>Medicamentos em Uso: {registroMedico.medicationsInUse.join(', ')}</p>
                                <p>Diagnóstico: {registroMedico.diagnosis.join(', ')}</p>
                            </div>
                        )}

                        {/* Form Fields */}
                        <div className='mt-6'>
                            <h3 className='text-xl font-semibold'>Dados da Ficha Neurofuncional</h3>

                            <label className="block mb-2">
                                Diagnóstico Médico:
                                <input
                                    type="text"
                                    value={medicalDiagnosis}
                                    onChange={(e) => setMedicalDiagnosis(e.target.value)}
                                    placeholder="Digite o diagnóstico médico"
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            <label className="block mb-2">
                                Anamnese:
                                <textarea
                                    value={anamnesis}
                                    onChange={(e) => setAnamnesis(e.target.value)}
                                    placeholder="Digite a anamnese"
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            <label className="block mb-2">
                                Exame Físico:
                                <textarea
                                    value={physicalExamination}
                                    onChange={(e) => setPhysicalExamination(e.target.value)}
                                    placeholder="Digite o exame físico"
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            <label className="block mb-2">
                                Triage:
                                <input
                                    type="text"
                                    value={triage}
                                    onChange={(e) => setTriage(e.target.value)}
                                    placeholder="Digite a triagem"
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            {/* Lifestyle Habits */}
                            <h3 className='mt-4 text-lg font-semibold'>Hábitos de Vida</h3>
                            {Object.keys(lifestyleHabits).map((key) => (
                                <label className="block mb-2" key={key}>
                                    <input
                                        type="checkbox"
                                        checked={lifestyleHabits[key as keyof typeof lifestyleHabits]}
                                        onChange={(e) =>
                                            setLifestyleHabits({
                                                ...lifestyleHabits,
                                                [key]: e.target.checked,
                                            })
                                        }
                                    />
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                                </label>
                            ))}

                            {/* Vital Signs */}
                            <h3 className='mt-4 text-lg font-semibold'>Sinais Vitais</h3>
                            {Object.keys(vitalSigns).map((key) => (
                                <label className="block mb-2" key={key}>
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:
                                    <input
                                        type="number"
                                        value={vitalSigns[key as keyof typeof vitalSigns]}
                                        onChange={(e) =>
                                            setVitalSigns({
                                                ...vitalSigns,
                                                [key]: Number(e.target.value),
                                            })
                                        }
                                        className="border rounded w-full py-2 px-3 mt-1"
                                    />
                                </label>
                            ))}

                            {/* Physical Inspection */}
                            <h3 className='mt-4 text-lg font-semibold'>Inspeção Física</h3>
                            {Object.keys(physicalInspection).map((key) => (
                                <label className="block mb-2" key={key}>
                                    <input
                                        type="checkbox"
                                        checked={physicalInspection[key as keyof typeof physicalInspection]}
                                        onChange={(e) =>
                                            setPhysicalInspection({
                                                ...physicalInspection,
                                                [key]: e.target.checked,
                                            })
                                        }
                                    />
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                                </label>
                            ))}

                            {/* Sensory Assessment */}
                            <h3 className='mt-4 text-lg font-semibold'>Avaliação Sensorial</h3>
                            <label className="block mb-2">
                                Superficial:
                                <select
                                    value={sensoryAssessment.superficial}
                                    onChange={(e) => setSensoryAssessment({
                                        ...sensoryAssessment,
                                        superficial: e.target.value
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                >
                                    <option value="Tactile">Tátil</option>
                                    <option value="Pain">Dor</option>
                                </select>
                            </label>
                            <label className="block mb-2">
                                Profundo:
                                <select
                                    value={sensoryAssessment.deep}
                                    onChange={(e) => setSensoryAssessment({...sensoryAssessment, deep: e.target.value})}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                >
                                    <option value="PositionSense">Sentido de Posição</option>
                                    <option value="Vibration">Vibração</option>
                                </select>
                            </label>

                            {/* Patient Mobility */}
                            <h3 className='mt-4 text-lg font-semibold'>Avaliação de Mobilidade do Paciente</h3>
                            <label className="block mb-2">
                                Tempo de Caminhada de 3 Metros (segundos):
                                <input
                                    type="number"
                                    value={patientMobility.threeMeterWalkTimeInSeconds}
                                    onChange={(e) => setPatientMobility({
                                        ...patientMobility,
                                        threeMeterWalkTimeInSeconds: Number(e.target.value)
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Risco de Queda:
                                <input
                                    type="checkbox"
                                    checked={patientMobility.hasFallRisk}
                                    onChange={(e) => setPatientMobility({
                                        ...patientMobility,
                                        hasFallRisk: e.target.checked
                                    })}
                                />
                            </label>

                            {/* Physiotherapy Assessment */}
                            <h3 className='mt-4 text-lg font-semibold'>Avaliação Fisioterapêutica</h3>
                            <label className="block mb-2">
                                Diagnóstico:
                                <input
                                    type="text"
                                    value={physiotherapyAssessment.diagnosis}
                                    onChange={(e) => setPhysiotherapyAssessment({
                                        ...physiotherapyAssessment,
                                        diagnosis: e.target.value
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Objetivos do Tratamento:
                                <textarea
                                    value={physiotherapyAssessment.treatmentGoals}
                                    onChange={(e) => setPhysiotherapyAssessment({
                                        ...physiotherapyAssessment,
                                        treatmentGoals: e.target.value
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Conduta Fisioterapêutica:
                                <textarea
                                    value={physiotherapyAssessment.physiotherapeuticConduct}
                                    onChange={(e) => setPhysiotherapyAssessment({
                                        ...physiotherapyAssessment,
                                        physiotherapeuticConduct: e.target.value
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            {/* Submit Button */}
                            <ButtonOne texto="Criar Ficha Neurofuncional" onClick={handleCreateFicha}/>
                        </div>
                    </div>
                )}
            </div>

            <Footer/>
        </div>
    );
};

export default CriarNeurofuncional;
