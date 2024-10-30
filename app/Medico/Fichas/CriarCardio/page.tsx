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

interface LifestyleHabits {
    alcoholConsumption: boolean;
    smoker: boolean;
    obesity: boolean;
    diabetes: boolean;
    drugUser: boolean;
    physicalActivity: boolean;
}

const CriarCardio = () => {
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
        heartRate: 0,
        respiratoryRate: 0,
        bloodPressure: { systolic: 0, diastolic: 0 },
        temperature: 0,
        oxygenSaturation: 0,
    });

    // Physical Inspection
    const [physicalInspection, setPhysicalInspection] = useState({
        isFaceSinusPalpationHurtful: false,
        nasalSecretion: { type: "purulent", isFetid: false, quantity: "large" },
        nasalItching: "intermittent",
        sneezing: "intermittent",
        chestType: "kyphotic",
        respiratoryOrCardiacSigns: "accessory",
    });

    // Pneumofunctional Assessment
    const [pneumofunctionalAssessment, setPneumofunctionalAssessment] = useState({
        peakFlow: { firstMeasurement: 0, secondMeasurement: 0, thirdMeasurement: 0 },
        manovacuometry: {
            pemax: { firstMeasurement: 0, secondMeasurement: 0, thirdMeasurement: 0 },
            pimax: { firstMeasurement: 0, secondMeasurement: 0, thirdMeasurement: 0 },
        },
    });

    // Cardiofunctional Assessment
    const [cardiofunctionalAssessment, setCardiofunctionalAssessment] = useState({
        bmi: 0,
        abdominalPerimeter: 0,
        waistHipRatio: 0,
        bioimpedance: { bodyFat: 0, visceralFat: 0, muscleMassPercentage: 0 },
        adipometry: {
            skinfoldMeasurements: { bicipital: 0, tricipital: 0, subscapular: 0, abdominal: 0 },
        },
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

        const url = `/cardiorespiratory-record/patient-id/${patientId}/clinician-id/${clinicianId}`;

        const body = {
            medicalDiagnosis: medicalDiagnosis || "Nothing. No diagnosis whatsoever.",
            anamnesis: anamnesis || "Pacient anamnesis. An history of the disease and other things.",
            physicalExamination: physicalExamination || "The physical state of the patient. Important information about the situation will be included here.",
            triage: triage || "blue",
            lifestyleHabits: {
                alcoholConsumption: lifestyleHabits.alcoholConsumption,
                smoker: lifestyleHabits.smoker,
                obesity: lifestyleHabits.obesity,
                diabetes: lifestyleHabits.diabetes,
                drugUser: lifestyleHabits.drugUser,
                physicalActivity: lifestyleHabits.physicalActivity,
            },
            physicalInspection: {
                isFaceSinusPalpationHurtful: physicalInspection.isFaceSinusPalpationHurtful,
                nasalSecretion: {
                    type: physicalInspection.nasalSecretion.type,
                    isFetid: physicalInspection.nasalSecretion.isFetid,
                    quantity: physicalInspection.nasalSecretion.quantity,
                },
                nasalItching: physicalInspection.nasalItching,
                sneezing: physicalInspection.sneezing,
                chestType: physicalInspection.chestType,
                respiratoryOrCardiacSigns: physicalInspection.respiratoryOrCardiacSigns,
            },
            VitalSigns: { // Altere 'vitalSigns' para 'VitalSigns'
                heartRate: vitalSigns.heartRate,
                respiratoryRate: vitalSigns.respiratoryRate,
                bloodPressure: {
                    systolic: vitalSigns.bloodPressure.systolic,
                    diastolic: vitalSigns.bloodPressure.diastolic,
                },
                temperature: vitalSigns.temperature,
                oxygenSaturation: vitalSigns.oxygenSaturation,
            },
            pneumofunctionalAssessment: {
                peakFlow: {
                    firstMeasurement: pneumofunctionalAssessment.peakFlow.firstMeasurement,
                    secondMeasurement: pneumofunctionalAssessment.peakFlow.secondMeasurement,
                    thirdMeasurement: pneumofunctionalAssessment.peakFlow.thirdMeasurement,
                },
                manovacuometry: {
                    pemax: {
                        firstMeasurement: pneumofunctionalAssessment.manovacuometry.pemax.firstMeasurement,
                        secondMeasurement: pneumofunctionalAssessment.manovacuometry.pemax.secondMeasurement,
                        thirdMeasurement: pneumofunctionalAssessment.manovacuometry.pemax.thirdMeasurement,
                    },
                    pimax: {
                        firstMeasurement: pneumofunctionalAssessment.manovacuometry.pimax.firstMeasurement,
                        secondMeasurement: pneumofunctionalAssessment.manovacuometry.pimax.secondMeasurement,
                        thirdMeasurement: pneumofunctionalAssessment.manovacuometry.pimax.thirdMeasurement,
                    },
                },
            },
            cardiofunctionalAssessment: {
                bmi: cardiofunctionalAssessment.bmi,
                abdominalPerimeter: cardiofunctionalAssessment.abdominalPerimeter,
                waistHipRatio: cardiofunctionalAssessment.waistHipRatio,
                bioimpedance: {
                    bodyFat: cardiofunctionalAssessment.bioimpedance.bodyFat,
                    visceralFat: cardiofunctionalAssessment.bioimpedance.visceralFat,
                    muscleMassPercentage: cardiofunctionalAssessment.bioimpedance.muscleMassPercentage,
                },
                adipometry: {
                    skinfoldMeasurements: {
                        bicipital: cardiofunctionalAssessment.adipometry.skinfoldMeasurements.bicipital,
                        tricipital: cardiofunctionalAssessment.adipometry.skinfoldMeasurements.tricipital,
                        subscapular: cardiofunctionalAssessment.adipometry.skinfoldMeasurements.subscapular,
                        abdominal: cardiofunctionalAssessment.adipometry.skinfoldMeasurements.abdominal,
                    },
                },
            },
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

            // Verifique se o status é 201 (Criado) ou 200 (OK)
            if (response.status === 201 || response.status === 200) {
                alert('Ficha cardiorrespiratória criada com sucesso!');
                router.push('/Medico/Fichas');
            } else {
                alert('Erro ao criar ficha cardiorrespiratória.');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Erro ao criar ficha cardiorrespiratória:', error.response.data);
                alert(`Erro: ${error.response.data.message || 'Erro ao criar ficha cardiorrespiratória.'}`);
            } else {
                console.error('Erro inesperado:', error);
                alert('Erro ao criar ficha cardiorrespiratória.');
            }
        }

    };



    const translateHabit = (habit: string) => {
        const translations: Record<string, string> = {
            alcoholConsumption: 'Consumo de Álcool',
            smoker: 'Fumante',
            obesity: 'Obesidade',
            diabetes: 'Diabetes',
            drugUser: 'Usuário de Drogas',
            physicalActivity: 'Atividade Física',
        };
        return translations[habit] || habit; // Retorna a tradução ou a chave original se não houver tradução
    };

    return (
        <div className="flex flex-col min-h-screen p-8 pb-20 sm:p-20 font-[var(--font-geist-sans)]">
            <NavbarDoctor/>
            <div className="flex flex-col gap-8">
                <h1 className='text-3xl font-bold mb-4'>Criar Ficha Cardiorrespiratória</h1>
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
                            <h3 className='text-xl font-semibold'>Dados da Ficha Cardiorrespiratória</h3>

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
                                    placeholder="História da doença e outras informações."
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            {/* Exame Físico */}
                            <label className="block mb-2">
                                Exame Físico:
                                <textarea
                                    value={physicalExamination}
                                    onChange={(e) => setPhysicalExamination(e.target.value)}
                                    placeholder="Estado físico do paciente."
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            {/* Triagem */}
                            <label className="block mb-2">
                                Triagem:
                                <select
                                    value={triage}
                                    onChange={(e) => setTriage(e.target.value)}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                >
                                    <option value="blue">Azul</option>
                                    <option value="green">Verde</option>
                                    <option value="yellow">Amarelo</option>
                                    <option value="red">Vermelho</option>
                                </select>
                            </label>

                            {/* Hábitos de Vida */}
                            <h4 className='font-semibold'>Hábitos de Vida</h4>
                            {Object.keys(lifestyleHabits).map((habit) => (
                                <label key={habit} className="block mb-2">
                                    <input
                                        type="checkbox"
                                        checked={lifestyleHabits[habit as keyof LifestyleHabits]} // Use o tipo de índice
                                        onChange={(e) => setLifestyleHabits({
                                            ...lifestyleHabits,
                                            [habit as keyof LifestyleHabits]: e.target.checked // Use o tipo de índice
                                        })}
                                    />
                                    {translateHabit(habit)} {/* Exibindo a tradução */}
                                </label>
                            ))}

                            {/* Inspeção Física */}
                            <h4 className='font-semibold'>Inspeção Física</h4>

                            {/* Palpação dos seios da face dolorosa */}
                            <label className="block mb-2">
                                <input
                                    type="checkbox"
                                    checked={physicalInspection.isFaceSinusPalpationHurtful}
                                    onChange={(e) => setPhysicalInspection({
                                        ...physicalInspection,
                                        isFaceSinusPalpationHurtful: e.target.checked
                                    })}
                                />
                                Palpação dos seios da face dolorosa
                            </label>

                            {/* Secreção Nasal */}
                            <label className="block mb-2">
                                Tipo de Secreção Nasal:
                                <select
                                    value={physicalInspection.nasalSecretion.type}
                                    onChange={(e) => setPhysicalInspection({
                                        ...physicalInspection,
                                        nasalSecretion: {
                                            ...physicalInspection.nasalSecretion,
                                            type: e.target.value
                                        }
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                >
                                    <option value="purulent">Purulenta</option>
                                    <option value="serous">Serosa</option>
                                    <option value="mucoid">Mucoide</option>
                                </select>
                            </label>

                            <label className="block mb-2">
                                Secreção Nasal é Fetida:
                                <input
                                    type="checkbox"
                                    checked={physicalInspection.nasalSecretion.isFetid}
                                    onChange={(e) => setPhysicalInspection({
                                        ...physicalInspection,
                                        nasalSecretion: {
                                            ...physicalInspection.nasalSecretion,
                                            isFetid: e.target.checked
                                        }
                                    })}
                                />
                            </label>

                            <label className="block mb-2">
                                Quantidade de Secreção Nasal:
                                <select
                                    value={physicalInspection.nasalSecretion.quantity}
                                    onChange={(e) => setPhysicalInspection({
                                        ...physicalInspection,
                                        nasalSecretion: {
                                            ...physicalInspection.nasalSecretion,
                                            quantity: e.target.value
                                        }
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                >
                                    <option value="none">Nenhuma</option>
                                    <option value="small">Pequena</option>
                                    <option value="moderate">Moderada</option>
                                    <option value="large">Grande</option>
                                </select>
                            </label>

                            {/* Coceira Nasal */}
                            <label className="block mb-2">
                                Coceira Nasal:
                                <select
                                    value={physicalInspection.nasalItching}
                                    onChange={(e) => setPhysicalInspection({
                                        ...physicalInspection,
                                        nasalItching: e.target.value
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                >
                                    <option value="none">Nenhuma</option>
                                    <option value="intermittent">Intermitente</option>
                                    <option value="constant">Constante</option>
                                </select>
                            </label>

                            {/* Espirros */}
                            <label className="block mb-2">
                                Espirros:
                                <select
                                    value={physicalInspection.sneezing}
                                    onChange={(e) => setPhysicalInspection({
                                        ...physicalInspection,
                                        sneezing: e.target.value
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                >
                                    <option value="none">Nenhum</option>
                                    <option value="intermittent">Intermitente</option>
                                    <option value="constant">Constante</option>
                                </select>
                            </label>

                            {/* Tipo de Tórax */}
                            <label className="block mb-2">
                                Tipo de Tórax:
                                <select
                                    value={physicalInspection.chestType}
                                    onChange={(e) => setPhysicalInspection({
                                        ...physicalInspection,
                                        chestType: e.target.value
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="kyphotic">Cifótico</option>
                                    <option value="lordotic">Lordótico</option>
                                    <option value="flat">Plano</option>
                                </select>
                            </label>

                            {/* Sinais Respiratórios ou Cardíacos */}
                            <label className="block mb-2">
                                Sinais Respiratórios ou Cardíacos:
                                <select
                                    value={physicalInspection.respiratoryOrCardiacSigns}
                                    onChange={(e) => setPhysicalInspection({
                                        ...physicalInspection,
                                        respiratoryOrCardiacSigns: e.target.value
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                >
                                    <option value="none">Nenhum</option>
                                    <option value="accessory">Acessórios</option>
                                    <option value="diminished">Diminuídos</option>
                                    <option value="wheezing">Sibilante</option>
                                </select>
                            </label>
                            {/* Outros campos de Inspeção Física, Secreção Nasal etc. */}

                            {/* Sinais Vitais */}
                            <h4 className='font-semibold'>Sinais Vitais</h4>

                            {/* Frequência Cardíaca */}
                            <label className="block mb-2">
                                Frequência Cardíaca:
                                <input
                                    type="number"
                                    value={vitalSigns.heartRate}
                                    onChange={(e) => setVitalSigns({
                                        ...vitalSigns,
                                        heartRate: parseInt(e.target.value)
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            {/* Taxa Respiratória */}
                            <label className="block mb-2">
                                Taxa Respiratória:
                                <input
                                    type="number"
                                    value={vitalSigns.respiratoryRate}
                                    onChange={(e) => setVitalSigns({
                                        ...vitalSigns,
                                        respiratoryRate: parseInt(e.target.value)
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            {/* Pressão Arterial */}
                            <h5 className='font-semibold mt-4'>Pressão Arterial</h5>
                            <label className="block mb-2">
                                Sistólica:
                                <input
                                    type="number"
                                    value={vitalSigns.bloodPressure.systolic}
                                    onChange={(e) => setVitalSigns({
                                        ...vitalSigns,
                                        bloodPressure: {
                                            ...vitalSigns.bloodPressure,
                                            systolic: parseInt(e.target.value)
                                        }
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Diastólica:
                                <input
                                    type="number"
                                    value={vitalSigns.bloodPressure.diastolic}
                                    onChange={(e) => setVitalSigns({
                                        ...vitalSigns,
                                        bloodPressure: {
                                            ...vitalSigns.bloodPressure,
                                            diastolic: parseInt(e.target.value)
                                        }
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            {/* Temperatura */}
                            <label className="block mb-2">
                                Temperatura:
                                <input
                                    type="number"
                                    value={vitalSigns.temperature}
                                    onChange={(e) => setVitalSigns({
                                        ...vitalSigns,
                                        temperature: parseFloat(e.target.value)
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            {/* Saturação de Oxigênio */}
                            <label className="block mb-2">
                                Saturação de Oxigênio:
                                <input
                                    type="number"
                                    value={vitalSigns.oxygenSaturation}
                                    onChange={(e) => setVitalSigns({
                                        ...vitalSigns,
                                        oxygenSaturation: parseInt(e.target.value)
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>


                            {/* Avaliação Pneumofuncional */}
                            <h4 className='font-semibold'>Avaliação Pneumofuncional</h4>
                            <label className="block mb-2">
                                Pico de Fluxo - Primeira Medição:
                                <input
                                    type="number"
                                    value={pneumofunctionalAssessment.peakFlow.firstMeasurement}
                                    onChange={(e) => setPneumofunctionalAssessment({
                                        ...pneumofunctionalAssessment,
                                        peakFlow: {
                                            ...pneumofunctionalAssessment.peakFlow,
                                            firstMeasurement: parseInt(e.target.value)
                                        }
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            {/* Avaliação Cardiofuncional */}
                            <h4 className='font-semibold'>Avaliação Cardiofuncional</h4>

                            {/* IMC */}
                            <label className="block mb-2">
                                IMC:
                                <input
                                    type="number"
                                    value={cardiofunctionalAssessment.bmi}
                                    onChange={(e) => setCardiofunctionalAssessment({
                                        ...cardiofunctionalAssessment,
                                        bmi: parseFloat(e.target.value)
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            {/* Perímetro Abdominal */}
                            <label className="block mb-2">
                                Perímetro Abdominal:
                                <input
                                    type="number"
                                    value={cardiofunctionalAssessment.abdominalPerimeter}
                                    onChange={(e) => setCardiofunctionalAssessment({
                                        ...cardiofunctionalAssessment,
                                        abdominalPerimeter: parseFloat(e.target.value)
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            {/* Relação Cintura-Quadril */}
                            <label className="block mb-2">
                                Relação Cintura-Quadril:
                                <input
                                    type="number"
                                    value={cardiofunctionalAssessment.waistHipRatio}
                                    onChange={(e) => setCardiofunctionalAssessment({
                                        ...cardiofunctionalAssessment,
                                        waistHipRatio: parseFloat(e.target.value)
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            {/* Bioimpedância */}
                            <h5 className='font-semibold'>Bioimpedância</h5>
                            <label className="block mb-2">
                                Gordura Corporal:
                                <input
                                    type="number"
                                    value={cardiofunctionalAssessment.bioimpedance.bodyFat}
                                    onChange={(e) => setCardiofunctionalAssessment({
                                        ...cardiofunctionalAssessment,
                                        bioimpedance: {
                                            ...cardiofunctionalAssessment.bioimpedance,
                                            bodyFat: parseFloat(e.target.value)
                                        }
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            <label className="block mb-2">
                                Gordura Visceral:
                                <input
                                    type="number"
                                    value={cardiofunctionalAssessment.bioimpedance.visceralFat}
                                    onChange={(e) => setCardiofunctionalAssessment({
                                        ...cardiofunctionalAssessment,
                                        bioimpedance: {
                                            ...cardiofunctionalAssessment.bioimpedance,
                                            visceralFat: parseFloat(e.target.value)
                                        }
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            <label className="block mb-2">
                                Percentagem de Massa Muscular:
                                <input
                                    type="number"
                                    value={cardiofunctionalAssessment.bioimpedance.muscleMassPercentage}
                                    onChange={(e) => setCardiofunctionalAssessment({
                                        ...cardiofunctionalAssessment,
                                        bioimpedance: {
                                            ...cardiofunctionalAssessment.bioimpedance,
                                            muscleMassPercentage: parseFloat(e.target.value)
                                        }
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            {/* Adipometria */}
                            <h5 className='font-semibold'>Adipometria</h5>
                            <label className="block mb-2">
                                Medidas de Pregas Cutâneas - Bicipital:
                                <input
                                    type="number"
                                    value={cardiofunctionalAssessment.adipometry.skinfoldMeasurements.bicipital}
                                    onChange={(e) => setCardiofunctionalAssessment({
                                        ...cardiofunctionalAssessment,
                                        adipometry: {
                                            ...cardiofunctionalAssessment.adipometry,
                                            skinfoldMeasurements: {
                                                ...cardiofunctionalAssessment.adipometry.skinfoldMeasurements,
                                                bicipital: parseFloat(e.target.value)
                                            }
                                        }
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            <label className="block mb-2">
                                Medidas de Pregas Cutâneas - Tricipital:
                                <input
                                    type="number"
                                    value={cardiofunctionalAssessment.adipometry.skinfoldMeasurements.tricipital}
                                    onChange={(e) => setCardiofunctionalAssessment({
                                        ...cardiofunctionalAssessment,
                                        adipometry: {
                                            ...cardiofunctionalAssessment.adipometry,
                                            skinfoldMeasurements: {
                                                ...cardiofunctionalAssessment.adipometry.skinfoldMeasurements,
                                                tricipital: parseFloat(e.target.value)
                                            }
                                        }
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            <label className="block mb-2">
                                Medidas de Pregas Cutâneas - Subescapular:
                                <input
                                    type="number"
                                    value={cardiofunctionalAssessment.adipometry.skinfoldMeasurements.subscapular}
                                    onChange={(e) => setCardiofunctionalAssessment({
                                        ...cardiofunctionalAssessment,
                                        adipometry: {
                                            ...cardiofunctionalAssessment.adipometry,
                                            skinfoldMeasurements: {
                                                ...cardiofunctionalAssessment.adipometry.skinfoldMeasurements,
                                                subscapular: parseFloat(e.target.value)
                                            }
                                        }
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            <label className="block mb-2">
                                Medidas de Pregas Cutâneas - Abdominal:
                                <input
                                    type="number"
                                    value={cardiofunctionalAssessment.adipometry.skinfoldMeasurements.abdominal}
                                    onChange={(e) => setCardiofunctionalAssessment({
                                        ...cardiofunctionalAssessment,
                                        adipometry: {
                                            ...cardiofunctionalAssessment.adipometry,
                                            skinfoldMeasurements: {
                                                ...cardiofunctionalAssessment.adipometry.skinfoldMeasurements,
                                                abdominal: parseFloat(e.target.value)
                                            }
                                        }
                                    })}
                                    className="border rounded w-full py-2 px-3 mt-1"
                                />
                            </label>

                            <ButtonOne texto="Criar Ficha Cardiorrespiratória" onClick={handleCreateFicha}/>
                        </div>
                    </div>
                )}
            </div>
            <Footer/>
        </div>

    );
};

export default CriarCardio;
