'use client';
import React, { useEffect, useState } from 'react';
import api from "@/app/services/api";
import PrivateRoute from '@/app/components/PrivateRoute';
import NavbarDoctor from "@/app/components/NavbarDoctor";
import Footer from "@/app/components/Footer";
import ButtonOne from '@/app/components/ButtonOne';
import { useRouter } from 'next/navigation';

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
                <NavbarDoctor />
                <h2 className="font-bold text-4xl text-gray-700 pt-8">Visualizar Registro Cardiorespiratório</h2>

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
                            <h3 className="text-lg block text-gray-700 font-medium pb-6">Manovacuometria:</h3>
                            <p className='flex gap-2'><h3 className='font-semibold'>Terceira Medição do Fluxo de Pemax: </h3>{record.pneumofunctionalAssessment.manovacuometry.pemax.firstMeasurement}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Terceira Medição do Fluxo de Pemax: </h3>{record.pneumofunctionalAssessment.manovacuometry.pemax.secondMeasurement}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Terceira Medição do Fluxo de Pemax: </h3>{record.pneumofunctionalAssessment.manovacuometry.pemax.secondMeasurement}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Terceira Medição do Fluxo de Pimax: </h3>{record.pneumofunctionalAssessment.manovacuometry.pimax.firstMeasurement}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Terceira Medição do Fluxo de Pimax: </h3>{record.pneumofunctionalAssessment.manovacuometry.pimax.secondMeasurement}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Terceira Medição do Fluxo de Pimax: </h3>{record.pneumofunctionalAssessment.manovacuometry.pimax.thirdMeasurement}</p>
                        </div>

                        <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                            <h3 className="text-2xl block text-gray-700 font-medium pb-6">Avaliação Cardiofuncional:</h3>
                            <p className='flex gap-2'><h3 className='font-semibold'>IBM: </h3>{record.cardiofunctionalAssessment.bmi}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Perímetro Abdominal: </h3>{record.cardiofunctionalAssessment.abdominalPerimeter}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Relação Cintura-Quadril: </h3>{record.cardiofunctionalAssessment.waistHipRatio}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Gordura Corporal: </h3>{record.cardiofunctionalAssessment.bioimpedance.bodyFat}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Gordura Visceral: </h3>{record.cardiofunctionalAssessment.bioimpedance.visceralFat}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Porcentagem de Massa Muscular: </h3>{record.cardiofunctionalAssessment.bioimpedance.muscleMassPercentage}</p>
                            <h3 className="text-lg block text-gray-700 font-medium pb-6">Medidas de Pregas Cutâneas:</h3>
                            <p className='flex gap-2'><h3 className='font-semibold'>Bicipital: </h3>{record.cardiofunctionalAssessment.adipometry.skinfoldMeasurements.bicipital}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Tricipital: </h3>{record.cardiofunctionalAssessment.adipometry.skinfoldMeasurements.tricipital}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Subescapular: </h3>{record.cardiofunctionalAssessment.adipometry.skinfoldMeasurements.subscapular}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Abdominal: </h3>{record.cardiofunctionalAssessment.adipometry.skinfoldMeasurements.abdominal}</p>

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
