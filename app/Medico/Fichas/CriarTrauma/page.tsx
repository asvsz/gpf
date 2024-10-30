'use client';
import React, { useState, useEffect } from 'react';
import { useFetchPaciente } from '@/app/hooks/useFetchPaciente';
import { useFetchRegistroMedicoUniversal } from '@/app/hooks/useFetchRegistroMedicoUniversal';
import { useClinicians } from '@/app/hooks/useFetchClinico';
import api from '@/app/services/api';
import NavbarDoctor from "@/app/components/NavbarDoctor";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";
import ButtonOne from "@/app/components/ButtonOne";
import axios from 'axios';

interface Paciente {
    id: string;
    name: string;
    surname: string;
    cpf: string;
}

const CriarTrauma = () => {
    const {clinicianId, fetchClinicianIdByEmail} = useClinicians();
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [cpf, setCpf] = useState('');
    const [patientId, setPatientId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const router = useRouter();

    const [medicalDiagnosis, setMedicalDiagnosis] = useState('');
    const [anamnesis, setAnamnesis] = useState('');
    const [physicalExamination, setPhysicalExamination] = useState('');
    const [triage, setTriage] = useState('blue');

    // Palpação
    const [palpation, setPalpation] = useState('');
    const [edema, setEdema] = useState('');
    const [pittingTest, setPittingTest] = useState('');
    const [fingerPressureTest, setFingerPressureTest] = useState('');
    const [perimetry, setPerimetry] = useState({
        rightArm: 0,
        leftArm: 0,
        upperRightThigh: 0,
        upperLeftThigh: 0,
        lowerRightThigh: 0,
        lowerLeftThigh: 0,
        rightKnee: 0,
        leftKnee: 0,
    });

    // Avaliação de dor subjetiva
    const [subjectivePainAssessment, setSubjectivePainAssessment] = useState({
        intensity: 0,
        location: '',
        characteristic: '',
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
            const email = localStorage.getItem('email');
            if (email) {
                await fetchClinicianIdByEmail(email);
            }
        };

        fetchClinicianId();
        fetchPacientes();
    }, []);

    const paciente = useFetchPaciente(patientId);
    const registroMedico = useFetchRegistroMedicoUniversal(patientId);

    const handleCpfSubmit = () => {
        const matchedPatient = pacientes.find((p) => p.cpf === cpf);
        matchedPatient ? setPatientId(matchedPatient.id) : alert('Paciente não encontrado!');
    };

    const handleCreateFicha = async () => {
        if (!patientId || !clinicianId) {
            alert('Paciente ou clínico não encontrado.');
            return;
        }

        const url = `/trauma-orthopedic-record/patient-id/${patientId}/clinician-id/${clinicianId}`;

        const body = {
            medicalDiagnosis: medicalDiagnosis || "Nothing. No diagnosis whatsoever.",
            anamnesis: anamnesis || "Paciente anamnesis. An history of the disease and other things.",
            physicalExamination: physicalExamination || "The physical state of the patient. Important information about the situation will be included here.",
            triage: triage || "blue",
            palpation: palpation || "Palpation of the patient.",
            edema: edema === "true", // Certifique-se de que seja um booleano
            pittingTest: pittingTest === "true", // Certifique-se de que seja um booleano
            fingerPressureTest: fingerPressureTest === "true", // Certifique-se de que seja um booleano
            perimetry: {
                rightArm: perimetry.rightArm || 0, // Use 0 como fallback se não houver valor
                leftArm: perimetry.leftArm || 0,
                upperRightThigh: perimetry.upperRightThigh || 0,
                upperLeftThigh: perimetry.upperLeftThigh || 0,
                lowerRightThigh: perimetry.lowerRightThigh || 0,
                lowerLeftThigh: perimetry.lowerLeftThigh || 0,
                rightKnee: perimetry.rightKnee || 0,
                leftKnee: perimetry.leftKnee || 0,
            },
            subjectivePainAssessment: {
                intensity: subjectivePainAssessment.intensity || 0, // Valor padrão
                location: subjectivePainAssessment.location || "N/A", // Valor padrão
                characteristic: subjectivePainAssessment.characteristic || "N/A", // Valor padrão
            },
            specialOrthopedicTest: "Special orthopedic test", // Adicione o valor adequado
        };

        try {
            const token = localStorage.getItem('access_token');
            const response = await api.post(url, body, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log("Resposta da API:", response); // Log da resposta para debug

            if (response.status === 201 || response.status === 200) {
                alert('Ficha de trauma criada com sucesso!');
                router.push('/Medico/Fichas');
            } else {
                alert('Erro ao criar ficha de trauma.');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Erro ao criar ficha de trauma:', error.response.data);
                alert(`Erro: ${error.response.data.message || 'Erro ao criar ficha de trauma.'}`);
            } else {
                console.error('Erro inesperado:', error);
                alert('Erro ao criar ficha de trauma.');
            }
        }
    };



    return (
        <div className="flex flex-col min-h-screen p-8 pb-20 sm:p-20 font-[var(--font-geist-sans)]">
            <NavbarDoctor/>
            <div className="flex flex-col gap-8">
                <h1 className='text-3xl font-bold mb-4'>Criar Ficha de Trauma</h1>
                {error && <p style={{color: 'red'}}>{error}</p>}

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
                    <ButtonOne texto={'Buscar Paciente'} onClick={handleCpfSubmit}/>
                </div>

                {paciente && (
                    <div className="border p-4 rounded bg-gray-100">
                        <h2 className='text-2xl'>Dados do Paciente</h2>
                        <p>Nome: {paciente.name} {paciente.surname}</p>
                        <p>CPF: {paciente.cpf}</p>

                        <div className='mt-6'>
                            <h3 className='text-xl font-semibold'>Dados da Ficha de Trauma</h3>

                            {/* Diagnóstico Médico */}
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

                            {/* Anamnese */}
                            <label className="block mb-2">
                                Anamnese:
                                <textarea
                                    value={anamnesis}
                                    onChange={(e) => setAnamnesis(e.target.value)}
                                    placeholder="Digite a anamnese"
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            {/* Exame Físico */}
                            <label className="block mb-2">
                                Exame Físico:
                                <textarea
                                    value={physicalExamination}
                                    onChange={(e) => setPhysicalExamination(e.target.value)}
                                    placeholder="Digite o exame físico"
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            {/* Triagem */}
                            <label className="block mb-2">
                                Triagem:
                                <textarea
                                    value={triage}
                                    onChange={(e) => setTriage(e.target.value)}
                                    placeholder="Digite a triagem"
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            {/* Palpação */}
                            <label className="block mb-2">
                                Palpação:
                                <textarea
                                    value={palpation}
                                    onChange={(e) => setPalpation(e.target.value)}
                                    placeholder="Digite a palpação"
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            {/* Edema */}
                            <label className="block mb-2">
                                Edema:
                                <textarea
                                    value={edema}
                                    onChange={(e) => setEdema(e.target.value)}
                                    placeholder="Digite as informações sobre edema"
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            {/* Teste de Pressão Digital */}
                            <label className="block mb-2">
                                Teste de Pressão Digital:
                                <textarea
                                    value={pittingTest}
                                    onChange={(e) => setPittingTest(e.target.value)}
                                    placeholder="Digite os resultados do teste de pressão digital"
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            {/* Perímetro */}
                            <label className="block mb-2">
                                Perímetro:
                                <input
                                    type="number"
                                    value={perimetry}
                                    onChange={(e) => setPerimetry(parseFloat(e.target.value))}
                                    placeholder="Digite o perímetro"
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            {/* Avaliação de Dor Subjetiva */}
                            <label className="block mb-2">
                                Avaliação de Dor Subjetiva:
                                <input
                                    type="number"
                                    value={subjectivePainAssessment}
                                    onChange={(e) => setSubjectivePainAssessment(parseInt(e.target.value))}
                                    placeholder="Avalie a dor de 0 a 10"
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            <ButtonOne texto="Criar Ficha de Trauma" onClick={handleCreateFicha}/>
                        </div>
                    </div>
                )}
            </div>
            <Footer/>
        </div>
    );
}
export default CriarTrauma;