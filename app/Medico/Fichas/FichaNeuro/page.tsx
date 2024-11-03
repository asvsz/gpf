'use client';
import React, { useEffect, useState } from 'react';
import api from "@/app/services/api";
import PrivateRoute from '@/app/components/PrivateRoute';
import NavbarDoctor from "@/app/components/NavbarDoctor";
import Footer from "@/app/components/Footer";
import { useRouter } from 'next/navigation';
import ButtonOne from '@/app/components/ButtonOne';

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

export default function ViewNeurofunctionalRecord() {
    const [record, setRecord] = useState<NeurofunctionalRecordProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter()

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

    // Carregar os dados quando o componente for montado
    useEffect(() => {
        fetchRecordData();
    }, []);



    // Exibição do formulário para visualização do registro neurofuncional
    return (
        <PrivateRoute requiredUserType='clinician'>
            <div className="flex flex-col min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <NavbarDoctor />
                <h2 className="font-bold text-4xl text-gray-700 pt-8">Visualizar Registro Neurofuncional</h2>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                {loading ? (
                    <div className="flex justify-center text-lg text-gray-500 items-center h-64">
                        <span>Carregando...</span>
                    </div>
                ) : record ? (
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
                        </div>

                        <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                                <h3 className="text-2xl block text-gray-700 font-medium pb-6">Sinais Vitais:</h3>
                                <p className='flex gap-2'><h3 className='font-semibold'>Pressão Arterial: </h3>{record.vitalSigns.bloodPressure}</p>
                                <p className='flex gap-2'><h3 className='font-semibold'>Frequência Cardíaca:</h3> {record.vitalSigns.heartRate}</p>
                        </div>

                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                                <h3 className="text-2xl block text-gray-700 font-medium pb-6">Inspeção Física:</h3>
                                <p className='flex gap-2'><h3 className='font-semibold'>Mobilidade Independente:</h3> {record.physicalInspection.independentMobility ? 'Sim' : 'Não'}</p>
                        </div>

                            <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                                <h3 className="text-2xl block text-gray-700 font-medium pb-6">Avaliação Sensória:</h3>
                                <p className='flex gap-2'><h3 className='font-semibold'>Superficial:</h3> {record.sensoryAssessment.superficial}</p>
                                <p className='flex gap-2'><h3 className='font-semibold'>Profunda:</h3> {record.sensoryAssessment.deep}</p>
                        </div>

                            <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                                <h3 className="text-2xl block text-gray-700 font-medium pb-6">Mobilidade do Paciente:</h3>
                                <p className='flex gap-2'><h3 className='font-semibold'>Tempo de Caminhada de 3 Metros:</h3> {record.patientMobility.threeMeterWalkTimeInSeconds} s</p>
                        </div>

                        <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                                <h3 className="text-2xl block text-gray-700 font-medium pb-6">Avaliação Fisioterapêutica:</h3>
                                <p className='flex gap-2'><h3 className='font-semibold'>Diagnóstico:</h3> {record.physiotherapyAssessment.diagnosis}</p>
                                <p className='flex gap-2'><h3 className='font-semibold'>Objetivos do Tratamento: </h3>{record.physiotherapyAssessment.treatmentGoals}</p>
                            </div>
                            <div className="flex w-full items-baseline justify-end gap-4 mt-4 pr-8">
                                <ButtonOne
                                    texto='Voltar'
                                    onClick={() => router.back()} />

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
