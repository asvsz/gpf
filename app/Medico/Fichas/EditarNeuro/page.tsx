'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from "@/app/services/api";
import { useAuth } from '@/app/context/AuthContext';
import SaveButton from '@/app/components/SaveButton';
import CancelButton from '@/app/components/CancelButton';
import axios from 'axios';
import PrivateRoute from '@/app/components/PrivateRoute';
import NavbarDoctor from "@/app/components/NavbarDoctor";
import Footer from "@/app/components/Footer";

interface NeurofunctionalRecordProps {
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
}

export default function EditNeurofunctionalRecord() {
    const router = useRouter();
    const [record, setRecord] = useState<NeurofunctionalRecordProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Função para buscar os dados do registro neurofuncional
    const fetchRecordData = async () => {
        const recordId = localStorage.getItem('currentRecordId');
        if (!recordId) {
            console.error('No record ID found.');
            return;
        }
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                throw new Error("Token não encontrado");
            }

            const response = await api.get(`/neurofunctional-record/by-id/${recordId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.data || !response.data.record) {
                throw new Error("Dados do registro não encontrados");
            }

            setRecord(response.data.record);
        } catch (error) {
            console.error('Erro ao buscar registro:', error);
            setError('Erro ao carregar os dados do registro.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (record) {
            const dataToSend = {
                ...record,
            };

            try {
                const token = localStorage.getItem("access_token");
                const recordId = localStorage.getItem('currentRecordId');
                await api.put(`/neurofunctional-record/${recordId}`, dataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                alert("Registro salvo com sucesso!");
                router.push('/Medico/Fichas'); // Redirecionar após salvar
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    console.error('Erro ao salvar registro:', error.response.data);
                    setError(`Erro ao salvar as alterações: ${error.response.data.message}`);
                } else {
                    console.error('Erro ao salvar registro:', error);
                    setError('Erro ao salvar as alterações.');
                }
            }
        }
    };

    // Carregar os dados quando o componente for montado
    useEffect(() => {
        fetchRecordData();
    }, []);


    // Exibição do formulário para edição do registro neurofuncional
    return (
        <PrivateRoute requiredUserType='clinician'>
            <div className="flex flex-col min-h-screen p-8 pb-20 gap-12 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <NavbarDoctor />
                <h1 className="font-bold text-4xl text-gray-700 pt-8">Editar Registro Neurofuncional</h1>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                {/* Loader e mensagem quando não há dados */}
                {loading ? (
                    <div className="flex justify-center text-lg text-gray-500 items-center h-64">
                        <span>Carregando...</span>
                    </div>
                ) : record ? (
                    <div className="grid gap-8 pb-8">
                        {/* Campos de Diagnóstico Médico */}
                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <label className="text-2xl block text-gray-700 font-medium pb-6">
                                Diagnóstico Médico
                            </label>
                            <textarea
                                value={record.medicalDiagnosis}
                                onChange={(e) => setRecord({ ...record, medicalDiagnosis: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Diagnóstico Médico"
                            />
                        </div>

                        {/* Campos de Anamnese */}
                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <label className="text-2xl block text-gray-700 font-medium pb-6">
                                Anamnese
                            </label>
                            <textarea
                                value={record.anamnesis}
                                onChange={(e) => setRecord({ ...record, anamnesis: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Anamnese"
                            />
                        </div>

                        {/* Campos de Exame Físico */}
                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <label className="text-2xl block text-gray-700 font-medium pb-6">
                                Exame Físico
                            </label>
                            <textarea
                                value={record.physicalExamination}
                                onChange={(e) => setRecord({ ...record, physicalExamination: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Exame Físico"
                            />
                        </div>

                        {/* Campos de Triagem */}
                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <label className="text-2xl block text-gray-700 font-medium pb-6">Triage</label>
                            <select
                                value={record.triage}
                                onChange={(e) => setRecord({ ...record, triage: e.target.value })}
                                className="text-lg block text-gray-800 font-medium border 
                                rounded-md mb-2 p-2"
                                required
                            >

                                <option value="" disabled>Selecione</option>
                                <option value="green">Verde</option>
                                <option value="yellow">Amarelo</option>
                                <option value="red">Vermelho</option>
                            </select>
                        </div>

                        {/* Campos de Hábitos de Vida */}
                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <label className="text-2xl block text-gray-700 font-medium pb-6">Hábitos de Vida</label>
                            <div className="flex gap-6">
                                <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={record.lifestyleHabits.alcoholConsumption}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            lifestyleHabits: { ...record.lifestyleHabits, alcoholConsumption: e.target.checked }
                                        })}
                                    />
                                    Consome Álcool
                                </label>
                                <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={record.lifestyleHabits.smoker}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            lifestyleHabits: { ...record.lifestyleHabits, smoker: e.target.checked }
                                        })}
                                    />
                                    Fumante
                                </label>
                                <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={record.lifestyleHabits.obesity}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            lifestyleHabits: { ...record.lifestyleHabits, obesity: e.target.checked }
                                        })}
                                    />
                                    Obesidade
                                </label>
                                <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={record.lifestyleHabits.diabetes}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            lifestyleHabits: { ...record.lifestyleHabits, diabetes: e.target.checked }
                                        })}
                                    />
                                    Diabetes
                                </label>
                                <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={record.lifestyleHabits.drugUser}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            lifestyleHabits: { ...record.lifestyleHabits, drugUser: e.target.checked }
                                        })}
                                    />
                                    Usa Drogas
                                </label>
                                <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={record.lifestyleHabits.physicalActivity}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            lifestyleHabits: { ...record.lifestyleHabits, physicalActivity: e.target.checked }
                                        })}
                                    />
                                    Atividade Física
                                </label>
                            </div>
                        </div>

                        {/* Campos de Sinais Vitais */}
                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <div className="flex flex-col gap-4">
                                <h3 className="text-2xl block text-gray-700 font-medium pb-6">Sinais Vitais</h3>
                                <label className="text-base font-semibold block text-gray-800 ">
                                    Pressão Arterial
                                </label>
                                <input
                                    type="number"
                                    value={record.vitalSigns.bloodPressure}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        vitalSigns: { ...record.vitalSigns, bloodPressure: +e.target.value }
                                    })}
                                    className="border rounded-md px-2 py-1"
                                    placeholder="Pressão Arterial"
                                />
                                <label className="text-base font-semibold block text-gray-800">
                                    Frequência Cardíaca
                                </label>
                                <input
                                    type="number"
                                    value={record.vitalSigns.heartRate}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        vitalSigns: { ...record.vitalSigns, heartRate: +e.target.value }
                                    })}
                                    className="border rounded-md px-2 py-1"
                                    placeholder="Frequência Cardíaca"
                                />

                                <label className="text-base font-semibold block text-gray-800">
                                    Frequência Respiratória
                                </label>
                                <input
                                    type="number"
                                    value={record.vitalSigns.respiratoryRate}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        vitalSigns: { ...record.vitalSigns, respiratoryRate: +e.target.value }
                                    })}
                                    className="border rounded-md px-2 py-1"
                                    placeholder="Frequência Cardíaca"
                                />
                                <label className="text-base font-semibold block text-gray-800">
                                    Saturação de Oxigênio
                                </label>
                                <input
                                    type="number"
                                    value={record.vitalSigns.oxygenSaturation}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        vitalSigns: { ...record.vitalSigns, oxygenSaturation: +e.target.value }
                                    })}
                                    className="border rounded-md px-2 py-1"
                                    placeholder="Frequência Cardíaca"
                                />
                                <label className="text-base font-semibold block text-gray-800">
                                    Temperatura Corporal
                                </label>
                                <input
                                    type="number"
                                    value={record.vitalSigns.bodyTemperature}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        vitalSigns: { ...record.vitalSigns, bodyTemperature: +e.target.value }
                                    })}
                                    className="border rounded-md px-2 py-1"
                                    placeholder="Frequência Cardíaca"
                                />
                            </div>
                        </div>

                        {/* Campos de Inspeção Física */}
                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <div className="flex flex-col gap-4">
                                <h3 className="text-2xl block text-gray-700 font-medium pb-6">Inspeção Física</h3>
                                <label className="flex gap-2 text-base font-normal text-gray-800">
                                    <input
                                        type="checkbox"
                                        checked={record.physicalInspection.independentMobility}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            physicalInspection: { ...record.physicalInspection, independentMobility: e.target.checked }
                                        })}
                                    />
                                    Mobilidade Independente
                                </label>
                                <label className="flex gap-2 text-base font-normal text-gray-800">
                                    <input
                                        type="checkbox"
                                        checked={record.physicalInspection.usesCrutches}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            physicalInspection: { ...record.physicalInspection, usesCrutches: e.target.checked }
                                        })}
                                    />
                                    Usa Muletas
                                </label>
                                <label className="flex gap-2 text-base font-normal text-gray-800">
                                    <input
                                        type="checkbox"
                                        checked={record.physicalInspection.usesWalker}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            physicalInspection: { ...record.physicalInspection, usesWalker: e.target.checked }
                                        })}
                                    />
                                    Usa Walker
                                </label>
                                <label className="flex gap-2 text-base font-normal text-gray-800">
                                    <input
                                        type="checkbox"
                                        checked={record.physicalInspection.wheelchairUser}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            physicalInspection: { ...record.physicalInspection, wheelchairUser: e.target.checked }
                                        })}
                                    />
                                    Usa Cadeiras de Rodas
                                </label>
                                <label className="flex gap-2 text-base font-normal text-gray-800">
                                    <input
                                        type="checkbox"
                                        checked={record.physicalInspection.hasScar}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            physicalInspection: { ...record.physicalInspection, hasScar: e.target.checked }
                                        })}
                                    />
                                    Tem Cicatriz
                                </label>
                                <label className="flex gap-2 text-base font-normal text-gray-800">
                                    <input
                                        type="checkbox"
                                        checked={record.physicalInspection.hasBedsore}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            physicalInspection: { ...record.physicalInspection, hasBedsore: e.target.checked }
                                        })}
                                    />
                                    Tem Escara
                                </label>
                                <label className="flex gap-2 text-base font-normal text-gray-800">
                                    <input
                                        type="checkbox"
                                        checked={record.physicalInspection.cooperative}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            physicalInspection: { ...record.physicalInspection, cooperative: e.target.checked }
                                        })}
                                    />
                                    Cooperativa
                                </label>
                                <label className="flex gap-2 text-base font-normal text-gray-800">
                                    <input
                                        type="checkbox"
                                        checked={record.physicalInspection.nonCooperative}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            physicalInspection: { ...record.physicalInspection, nonCooperative: e.target.checked }
                                        })}
                                    />
                                    Não Cooperativo
                                </label>
                                <label className="flex gap-2 text-base font-normal text-gray-800">
                                    <input
                                        type="checkbox"
                                        checked={record.physicalInspection.hydrated}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            physicalInspection: { ...record.physicalInspection, hydrated: e.target.checked }
                                        })}
                                    />
                                    Hidratado
                                </label>
                                <label className="flex gap-2 text-base font-normal text-gray-800">
                                    <input
                                        type="checkbox"
                                        checked={record.physicalInspection.hasHematoma}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            physicalInspection: { ...record.physicalInspection, hasHematoma: e.target.checked }
                                        })}
                                    />
                                    Tem Hematoma
                                </label>
                                <label className="flex gap-2 text-base font-normal text-gray-800">
                                    <input
                                        type="checkbox"
                                        checked={record.physicalInspection.hasEdema}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            physicalInspection: { ...record.physicalInspection, hasEdema: e.target.checked }
                                        })}
                                    />
                                    Tem Edema
                                </label>
                                <label className="flex gap-2 text-base font-normal text-gray-800">
                                    <input
                                        type="checkbox"
                                        checked={record.physicalInspection.hasDeformity}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            physicalInspection: { ...record.physicalInspection, hasDeformity: e.target.checked }
                                        })}
                                    />
                                    Tem Deformidade
                                </label>
                                {/* Adicione outros campos de inspeção física conforme necessário */}
                            </div>
                        </div>

                        {/* Campos de Avaliação Sensória */}
                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <div className="flex flex-col gap-4">
                                <h3 className="text-2xl block text-gray-700 font-medium pb-6">Avaliação Sensória</h3>

                                <label className="text-base font-semibold block text-gray-800">
                                    Avaliação Superficial
                                </label>
                                <input
                                    type="text"
                                    value={record.sensoryAssessment.superficial}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        sensoryAssessment: { ...record.sensoryAssessment, superficial: e.target.value }
                                    })}
                                    className="border rounded-md px-2 py-1"
                                    placeholder="Avaliação Superficial"
                                />

                                <label className="text-base font-semibold block text-gray-800">
                                    Avaliação Profunda
                                </label>
                                <input
                                    type="text"
                                    value={record.sensoryAssessment.deep}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        sensoryAssessment: { ...record.sensoryAssessment, deep: e.target.value }
                                    })}
                                    className="border rounded-md px-2 py-1"
                                    placeholder="Avaliação Profunda"
                                />

                                <label className="text-base font-semibold block text-gray-800">
                                    Combinação de Sensações
                                </label>
                                <div className="flex gap-6">
                                    <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">
                                        <input
                                            type="checkbox"
                                            checked={record.sensoryAssessment.combinedSensations.graphesthesia}
                                            onChange={(e) => setRecord({
                                                ...record,
                                                sensoryAssessment: {
                                                    ...record.sensoryAssessment,
                                                    combinedSensations: {
                                                        ...record.sensoryAssessment.combinedSensations,
                                                        graphesthesia: e.target.checked
                                                    }
                                                }
                                            })}
                                        />
                                        Grafestesia
                                    </label>
                                    <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">
                                        <input
                                            type="checkbox"
                                            checked={record.sensoryAssessment.combinedSensations.barognosis}
                                            onChange={(e) => setRecord({
                                                ...record,
                                                sensoryAssessment: {
                                                    ...record.sensoryAssessment,
                                                    combinedSensations: {
                                                        ...record.sensoryAssessment.combinedSensations,
                                                        barognosis: e.target.checked
                                                    }
                                                }
                                            })}
                                        />
                                        Barognose
                                    </label>
                                    <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">
                                        <input
                                            type="checkbox"
                                            checked={record.sensoryAssessment.combinedSensations.stereognosis}
                                            onChange={(e) => setRecord({
                                                ...record,
                                                sensoryAssessment: {
                                                    ...record.sensoryAssessment,
                                                    combinedSensations: {
                                                        ...record.sensoryAssessment.combinedSensations,
                                                        stereognosis: e.target.checked
                                                    }
                                                }
                                            })}
                                        />
                                        Estereognosia
                                    </label>
                                </div>

                            </div>
                        </div>

                        {/* Campos de Mobilidade do Paciente */}
                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <div className="flex flex-col gap-4">
                                <h3 className="text-2xl block text-gray-700 font-medium pb-6">Mobilidade do Paciente</h3>
                                <label className="text-base font-semibold block text-gray-800">
                                    Tempo de Caminhada de 3 Metros(s)
                                </label>
                                <input
                                    type="number"
                                    value={record.patientMobility.threeMeterWalkTimeInSeconds}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        patientMobility: { ...record.patientMobility, threeMeterWalkTimeInSeconds: +e.target.value }
                                    })}
                                    className="border rounded-md px-2 py-1"
                                    placeholder="Tempo de Caminhada de 3 Metros (s)"
                                />

                                <label className="flex gap-2 text-base font-semibold text-gray-800 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={record.patientMobility.hasFallRisk}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            patientMobility: { ...record.patientMobility, hasFallRisk: e.target.checked }
                                        })}
                                    />
                                    Risco de Queda
                                </label>

                                <label className="text-base font-semibold block text-gray-800">
                                    Mudanças de Postura
                                </label>
                                {Object.keys(record.patientMobility.postureChanges).map((key) => (
                                    <label key={key} className="flex flex-col mb-2">
                                        {key
                                            .replace(/([A-Z])/g, ' $1')
                                            .replace(/^./, (str) => str.toUpperCase())
                                            .replace('Bridge', 'Ponte')
                                            .replace('Semi Roll Right', 'Rolar para Direita')
                                            .replace('Semi Roll Left', 'Rolar para Esquerda')
                                            .replace('Full Roll', 'Rolar Completo')
                                            .replace('Drag', 'Arrastar')
                                            .replace('Prone To Forearm Support', 'Prono para Apoio de Antebraço')
                                            .replace('Forearm Support To All Fours', 'Apoio de Antebraço para Quatro Apoios')
                                            .replace('All Fours', 'Quatro Apoios')
                                            .replace('All Fours To Kneeling', 'Quatro Apoios para Ajoelhar')
                                            .replace('Kneeling To Half Kneeling Right', 'Ajoelhar para Meio Ajoelhar Direito')
                                            .replace('Kneeling To Half Kneeling Left', 'Ajoelhar para Meio Ajoelhar Esquerdo')
                                            .replace('Half Kneeling Right To Standing', 'Meio Ajoelhar Direito para Ficar em Pé')
                                            .replace('Half Kneeling Left To Standing', 'Meio Ajoelhar Esquerdo para Ficar em Pé')}
                                        :
                                        <input
                                            type="text"
                                            value={record.patientMobility.postureChanges[key as keyof typeof record.patientMobility.postureChanges]}
                                            onChange={(e) => setRecord({
                                                ...record,
                                                patientMobility: {
                                                    ...record.patientMobility,
                                                    postureChanges: {
                                                        ...record.patientMobility.postureChanges,
                                                        [key]: e.target.value
                                                    }
                                                }
                                            })}
                                            className="border rounded p-1 mt-1"
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Campos de Avaliação Fisioterapêutica */}
                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <div className="flex flex-col gap-4">
                                <h3 className="text-2xl block text-gray-700 font-medium pb-6">Avaliação Fisioterapêutica</h3>
                                <label className="text-base font-semibold block text-gray-800">
                                    Diagnóstico
                                </label>
                                <textarea
                                    value={record.physiotherapyAssessment.diagnosis}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        physiotherapyAssessment: { ...record.physiotherapyAssessment, diagnosis: e.target.value }
                                    })}
                                    className="border rounded-md p-2"
                                    placeholder="Diagnóstico"
                                />

                                <label className="text-base font-semibold block text-gray-800">
                                    Objetivos do Tratamento
                                </label>
                                <textarea
                                    value={record.physiotherapyAssessment.treatmentGoals}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        physiotherapyAssessment: { ...record.physiotherapyAssessment, treatmentGoals: e.target.value }
                                    })}
                                    className="border rounded-md p-2"
                                    placeholder="Objetivos do Tratamento"
                                />

                                <label className="text-base font-semibold block text-gray-800">
                                    Conduta Fisioterapêutica
                                </label>
                                <textarea
                                    value={record.physiotherapyAssessment.physiotherapeuticConduct}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        physiotherapyAssessment: { ...record.physiotherapyAssessment, physiotherapeuticConduct: e.target.value }
                                    })}
                                    className="border rounded-md p-2"
                                    placeholder="Conduta Fisioterapêutica"
                                />
                            </div>
                        </div>

                        <div className="flex w-full items-baseline justify-end gap-4 mt-4 pr-8">
                            <CancelButton onClick={() => router.push('/Medico/Fichas')} />
                            <SaveButton onClick={handleSave} />

                        </div>

                    </div>
                ) : (
                    <div>Registro não encontrado.</div>
                )}
                <Footer />
            </div>
        </PrivateRoute>
    );
}
