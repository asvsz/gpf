'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from "@/app/services/api";
import SaveButton from '@/app/components/SaveButton';
import CancelButton from '@/app/components/CancelButton';
import axios from 'axios';
import PrivateRoute from '@/app/components/PrivateRoute';
import NavbarDoctor from "@/app/components/NavbarDoctor";
import Footer from "@/app/components/Footer";

interface TraumaRecordProps {
    medicalDiagnosis: string;
    anamnesis: string;
    physicalExamination: string;
    triage: string;
    palpation: string;
    edema: boolean;
    pittingTest: boolean;
    fingerPressureTest: boolean;
    perimetry: {
        rightArm: number;
        leftArm: number;
        upperRightThigh: number;
        upperLeftThigh: number;
        lowerRightThigh: number;
        lowerLeftThigh: number;
        rightKnee: number;
        leftKnee: number;
    };
    subjectivePainAssessment: {
        intensity: number;
        location: string;
        characteristic: string;
    };
    specialOrthopedicTest: string;
}

export default function EditTraumaRecord() {
    const router = useRouter();
    const [record, setRecord] = useState<TraumaRecordProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Função para buscar os dados do registro de trauma
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

            const response = await api.get(`/trauma-orthopedic-record/by-id/${recordId}`, {
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
                await api.put(`/trauma-orthopedic-record/${recordId}`, dataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
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

    return (
        <PrivateRoute requiredUserType='clinician'>
            <div className="flex flex-col min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <NavbarDoctor />
                <h2 className="font-bold text-4xl text-gray-700 pt-8">Editar Registro de Trauma</h2>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                {/* Loader e mensagem quando não há dados */}
                {loading ? (
                    <div className="flex justify-center text-lg text-gray-500 items-center h-64">
                        <span>Carregando...</span>
                    </div>
                ) : record ? (
                    <div className="grid gap-8 pb-8">
                        <div className="bg-gray-100 shadow-lg rounded-lg p-6" >
                            <label className="text-2xl block text-gray-700 font-medium pb-6">Diagnóstico Médico</label>
                            <textarea
                                value={record.medicalDiagnosis}
                                onChange={(e) => setRecord({ ...record, medicalDiagnosis: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Diagnóstico Médico"
                            />
                        </div>

                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <label className="text-2xl block text-gray-700 font-medium pb-6">Anamnese</label>
                            <textarea
                                value={record.anamnesis}
                                onChange={(e) => setRecord({ ...record, anamnesis: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Anamnese"
                            />
                        </div>

                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <label className="text-2xl block text-gray-700 font-medium pb-6">Exame Físico</label>
                            <textarea
                                value={record.physicalExamination}
                                onChange={(e) => setRecord({ ...record, physicalExamination: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Exame Físico"
                            />
                        </div>

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
                                <option value="blue">Azul</option>
                            </select>
                        </div>

                        {/* Campo de Palpação */}
                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <label className="text-2xl block text-gray-700 font-medium pb-6">Palpação</label>
                            <textarea
                                value={record.palpation}
                                onChange={(e) => setRecord({ ...record, palpation: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Palpação"
                            />
                        </div>

                        {/* Teste de Edema e Pressão Digital */}

                        <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                            <label className="text-2xl block text-gray-700 font-medium pb-6">Teste de Edema e Pressão Digital</label>
                            <div>

                                <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={record.edema}
                                        onChange={(e) => setRecord({ ...record, edema: e.target.checked })}
                                    />
                                    Edema
                                </label>
                                <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={record.pittingTest}
                                        onChange={(e) => setRecord({ ...record, pittingTest: e.target.checked })}
                                    />
                                    Teste de Corrosão
                                </label>
                                <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={record.fingerPressureTest}
                                        onChange={(e) => setRecord({ ...record, fingerPressureTest: e.target.checked })}
                                    />
                                    Teste de Pressão Digital
                                </label>
                            </div>
                        </div>

                        {/* Campos de Perimetria */}
                        <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                            <h3 className="text-2xl block text-gray-700 font-medium pb-6">Perimetria</h3>
                            <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Braço Direito</label>
                            <input
                                type="number"
                                value={record.perimetry.rightArm}
                                onChange={(e) => setRecord({ ...record, perimetry: { ...record.perimetry, rightArm: +e.target.value } })}
                                className="border rounded-md px-2 py-1"
                            />
                            <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Braço Esquerdo</label>
                            <input
                                type="number"
                                value={record.perimetry.leftArm}
                                onChange={(e) => setRecord({ ...record, perimetry: { ...record.perimetry, leftArm: +e.target.value } })}
                                className="border rounded-md px-2 py-1"
                            />
                            <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Coxa Direita (Superior)</label>
                            <input
                                type="number"
                                value={record.perimetry.upperRightThigh}
                                onChange={(e) => setRecord({ ...record, perimetry: { ...record.perimetry, upperRightThigh: +e.target.value } })}
                                className="border rounded-md px-2 py-1"
                            />
                            <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Coxa Esquerda (Superior)</label>
                            <input
                                type="number"
                                value={record.perimetry.upperLeftThigh}
                                onChange={(e) => setRecord({ ...record, perimetry: { ...record.perimetry, upperLeftThigh: +e.target.value } })}
                                className="border rounded-md px-2 py-1"
                            />
                            <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Coxa Direita (Inferior)</label>
                            <input
                                type="number"
                                value={record.perimetry.lowerRightThigh}
                                onChange={(e) => setRecord({ ...record, perimetry: { ...record.perimetry, lowerRightThigh: +e.target.value } })}
                                className="border rounded-md px-2 py-1"
                            />
                            <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Coxa Esquerda (Inferior)</label>
                            <input
                                type="number"
                                value={record.perimetry.lowerLeftThigh}
                                onChange={(e) => setRecord({ ...record, perimetry: { ...record.perimetry, lowerLeftThigh: +e.target.value } })}
                                className="border rounded-md px-2 py-1"
                            />
                            <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Joelho Direito</label>
                            <input
                                type="number"
                                value={record.perimetry.rightKnee}
                                onChange={(e) => setRecord({ ...record, perimetry: { ...record.perimetry, rightKnee: +e.target.value } })}
                                className="border rounded-md px-2 py-1"
                            />
                            <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Joelho Esquerdo</label>
                            <input
                                type="number"
                                value={record.perimetry.leftKnee}
                                onChange={(e) => setRecord({ ...record, perimetry: { ...record.perimetry, leftKnee: +e.target.value } })}
                                className="border rounded-md px-2 py-1"
                            />
                        </div>

                        {/* Avaliação de Dor Subjetiva */}
                        <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                            <h3 className="text-2xl block text-gray-700 font-medium pb-6">Avaliação de Dor Subjetiva</h3>
                            <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Intensidade da Dor</label>
                            <input
                                type="number"
                                value={record.subjectivePainAssessment.intensity}
                                onChange={(e) => setRecord({
                                    ...record,
                                    subjectivePainAssessment: {
                                        ...record.subjectivePainAssessment,
                                        intensity: +e.target.value
                                    }
                                })}
                                className="border rounded-md px-2 py-1"
                            />
                            <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Localização da Dor</label>
                            <input
                                type="text"
                                value={record.subjectivePainAssessment.location}
                                onChange={(e) => setRecord({
                                    ...record,
                                    subjectivePainAssessment: {
                                        ...record.subjectivePainAssessment,
                                        location: e.target.value
                                    }
                                })}
                                className="border rounded-md px-2 py-1"
                            />
                            <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Característica da Dor</label>
                            <input
                                type="text"
                                value={record.subjectivePainAssessment.characteristic}
                                onChange={(e) => setRecord({
                                    ...record,
                                    subjectivePainAssessment: {
                                        ...record.subjectivePainAssessment,
                                        characteristic: e.target.value
                                    }
                                })}
                                className="border rounded-md px-2 py-1"
                            />
                            <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Teste Ortopédico Especial</label>
                            <input
                                type="text"
                                value={record.specialOrthopedicTest}
                                onChange={(e) => setRecord({
                                    ...record,
                                    specialOrthopedicTest: e.target.value
                                })}
                                className="border rounded-md px-2 py-1"
                            />
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
