'use client';
import React, { useEffect, useState } from 'react';
import api from "@/app/services/api";
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

export default function ViewNeurofunctionalRecord() {
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

    // Carregar os dados quando o componente for montado
    useEffect(() => {
        fetchRecordData();
    }, []);



    // Exibição do formulário para visualização do registro neurofuncional
    return (
        <PrivateRoute requiredUserType='clinician'>
            <div className="flex flex-col min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <NavbarDoctor/>
                <h2 className=" text-3xl font-bold">Visualizar Registro Neurofuncional</h2>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                {loading  ? (
                <div className="flex justify-center items-center h-64">
                    <span>Carregando...</span>
                </div>
                ): record ? (
                    <div className="flex flex-col mb-10">
                        <div>
                            <h3 className="font-semibold">Diagnóstico Médico:</h3>
                            <p>{record.medicalDiagnosis}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Anamnese:</h3>
                            <p>{record.anamnesis}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Exame Físico:</h3>
                            <p>{record.physicalExamination}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Triagem:</h3>
                            <p>{record.triage}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Hábitos de Vida:</h3>
                            <p>Consome Álcool: {record.lifestyleHabits.alcoholConsumption ? 'Sim' : 'Não'}</p>
                            <p>Fumante: {record.lifestyleHabits.smoker ? 'Sim' : 'Não'}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Sinais Vitais:</h3>
                            <p>Pressão Arterial: {record.vitalSigns.bloodPressure}</p>
                            <p>Frequência Cardíaca: {record.vitalSigns.heartRate}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Inspeção Física:</h3>
                            <p>Mobilidade Independente: {record.physicalInspection.independentMobility ? 'Sim' : 'Não'}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Avaliação Sensória:</h3>
                            <p>Superficial: {record.sensoryAssessment.superficial}</p>
                            <p>Profunda: {record.sensoryAssessment.deep}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Mobilidade do Paciente:</h3>
                            <p>Tempo de Caminhada de 3 Metros: {record.patientMobility.threeMeterWalkTimeInSeconds} s</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Avaliação Fisioterapêutica:</h3>
                            <p>Diagnóstico: {record.physiotherapyAssessment.diagnosis}</p>
                            <p>Objetivos do Tratamento: {record.physiotherapyAssessment.treatmentGoals}</p>
                        </div>
                    </div>
                ) : (
                    <div>Registro não encontrado.</div>
                )}
                <Footer/>
            </div>
        </PrivateRoute>
    );
}
