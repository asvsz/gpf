'use client';
import React, { useEffect, useState } from 'react';
import api from "@/app/services/api";
import PrivateRoute from '@/app/components/PrivateRoute';
import NavbarDoctor from "@/app/components/NavbarDoctor";
import Footer from "@/app/components/Footer";

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

            const response = await api.get(`/cardiorespiratory-record/by-id/${recordId}`, {
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

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <span>Carregando...</span>
                    </div>
                ) : record ? (
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
                            <p>Obesidade: {record.lifestyleHabits.obesity ? 'Sim' : 'Não'}</p>
                            <p>Diabetes: {record.lifestyleHabits.diabetes ? 'Sim' : 'Não'}</p>
                            <p>Usuário de Drogas: {record.lifestyleHabits.drugUser ? 'Sim' : 'Não'}</p>
                            <p>Atividade Física: {record.lifestyleHabits.physicalActivity ? 'Sim' : 'Não'}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Sinais Vitais:</h3>
                            <p>Frequência Cardíaca: {record.vitalSigns.heartRate}</p>
                            <p>Frequência Respiratória: {record.vitalSigns.respiratoryRate}</p>
                            <p>Pressão Arterial: {record.vitalSigns.bloodPressure.systolic}/{record.vitalSigns.bloodPressure.diastolic}</p>
                            <p>Temperatura: {record.vitalSigns.temperature}</p>
                            <p>Saturação de Oxigênio: {record.vitalSigns.oxygenSaturation}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Inspeção Física:</h3>
                            <p>Palpação Facial e Sinusal Dolorosa: {record.physicalInspection.isFaceSinusPalpationHurtful ? 'Sim' : 'Não'}</p>
                            <p>Tipo de Secreção Nasal: {record.physicalInspection.nasalSecretion.type}</p>
                            <p>Secreção Nasal Fetida: {record.physicalInspection.nasalSecretion.isFetid ? 'Sim' : 'Não'}</p>
                            <p>Quantidade de Secreção Nasal: {record.physicalInspection.nasalSecretion.quantity}</p>
                            <p>Coceira Nasal: {record.physicalInspection.nasalItching}</p>
                            <p>Espirros: {record.physicalInspection.sneezing}</p>
                            <p>Tipo de Tórax: {record.physicalInspection.chestType}</p>
                            <p>Sinais Respiratórios ou Cardíacos: {record.physicalInspection.respiratoryOrCardiacSigns}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Avaliação Pneumofuncional:</h3>
                            <p>Primeira Medição do Fluxo de Pico: {record.pneumofunctionalAssessment.peakFlow.firstMeasurement}</p>
                            <p>Segunda Medição do Fluxo de Pico: {record.pneumofunctionalAssessment.peakFlow.secondMeasurement}</p>
                            <p>Terceira Medição do Fluxo de Pico: {record.pneumofunctionalAssessment.peakFlow.thirdMeasurement}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Avaliação Cardiofuncional:</h3>
                            <p>IMC: {record.cardiofunctionalAssessment.bmi}</p>
                            <p>Perímetro Abdominal: {record.cardiofunctionalAssessment.abdominalPerimeter}</p>
                            <p>Relação Cintura-Qüadril: {record.cardiofunctionalAssessment.waistHipRatio}</p>
                            <p>Gordura Corporal: {record.cardiofunctionalAssessment.bioimpedance.bodyFat}</p>
                            <p>Gordura Visceral: {record.cardiofunctionalAssessment.bioimpedance.visceralFat}</p>
                            <p>Porcentagem de Massa Muscular: {record.cardiofunctionalAssessment.bioimpedance.muscleMassPercentage}</p>
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
