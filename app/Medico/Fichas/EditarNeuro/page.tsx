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
            <div className="flex flex-col min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <NavbarDoctor />
                <h1 className="font-bold text-4xl text-gray-700 pt-8 ">Editar Registro Neurofuncional</h1>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                {/* Loader e mensagem quando não há dados */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <span>Carregando...</span>
                    </div>
                ) : record ? (
                    <div className="flex flex-col gap-4 mb-10">
                        <label className="text-lg block text-gray-700 font-medium">
                            Diagnóstico Médico
                        </label>
                        <textarea
                            value={record.medicalDiagnosis}
                            onChange={(e) => setRecord({ ...record, medicalDiagnosis: e.target.value })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Diagnóstico Médico"
                        />


                        <label className="text-lg block text-gray-700 font-medium">
                            Anamnese
                        </label>
                        <textarea
                            value={record.anamnesis}
                            onChange={(e) => setRecord({ ...record, anamnesis: e.target.value })}
                            className="border rounded-md p-2"
                            placeholder="Anamnese"
                        />


                        <label className="text-lg block text-gray-700 font-medium">
                            Exame Físico
                        </label>
                        <textarea
                            value={record.physicalExamination}
                            onChange={(e) => setRecord({ ...record, physicalExamination: e.target.value })}
                            className="border rounded-md p-2"
                            placeholder="Exame Físico"
                        />

                        <div>
                            <label className="text-lg block text-gray-700 font-medium">Triage</label>
                            <select
                                value={record.triage}
                                onChange={(e) => setRecord({ ...record, triage: e.target.value })}
                                className="text-lg block text-gray-800 font-medium border rounded-md mb-2 p-2"
                                required
                            >

                                <option value="" disabled>Selecione</option>
                                <option value="green">Verde</option>
                                <option value="yellow">Amarelo</option>
                                <option value="red">Vermelho</option>
                            </select>
                        </div>

                        {/* Campos de Hábitos de Vida */}
                        <label className="text-lg block text-gray-700 font-medium">Hábitos de Vida</label>
                        <div className="flex gap-2">
                            <label className="text-base font-normal block text-gray-800 mb-2">
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
                            <label className="text-base font-normal block text-gray-800 mb-2">
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
                            {/* Adicione outros hábitos de vida conforme necessário */}
                        </div>

                        {/* Campos de Sinais Vitais */}
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg block text-gray-700 font-medium">Sinais Vitais</h3>
                            <label className="text-base font-normal block text-gray-800 ">
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
                            <label className="text-base font-normal block text-gray-800">
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
                            {/* Adicione outros sinais vitais conforme necessário */}
                        </div>

                        {/* Campos de Inspeção Física */}
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg block text-gray-700 font-medium">Inspeção Física</h3>
                            <label className="text-base font-normal block text-gray-800">
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
                            {/* Adicione outros campos de inspeção física conforme necessário */}
                        </div>

                        {/* Campos de Avaliação Sensória */}
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg block text-gray-700 font-medium">Avaliação Sensória</h3>

                            <label className="text-base font-normal block text-gray-800">
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
                            <label className="text-base font-normal block text-gray-800">
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
                        </div>

                        {/* Campos de Mobilidade do Paciente */}
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg block text-gray-700 font-medium">Mobilidade do Paciente</h3>
                            <label className="text-base font-normal block text-gray-800">
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
                            {/* Adicione outros campos de mobilidade conforme necessário */}
                        </div>

                        {/* Campos de Avaliação Fisioterapêutica */}
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg block text-gray-700 font-medium">Avaliação Fisioterapêutica</h3>
                            <label className="text-base font-normal block text-gray-800">
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
                            <label className="text-base font-normal block text-gray-800">
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
                            <label className="text-base font-normal block text-gray-800">
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

                        <div className="flex gap-2 mt-4">
                            <SaveButton onClick={handleSave} />
                            <CancelButton onClick={() => router.push('/Medico/Fichas')} />
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
