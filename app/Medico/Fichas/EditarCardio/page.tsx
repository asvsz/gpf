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
        nasalInspection: string;  // Adicionando a propriedade nasalInspection aqui
    };
    VitalSigns: {
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

export default function EditCardio() {
    const router = useRouter();
    const [record, setRecord] = useState<CardioRecordProps>({
        medicalDiagnosis: '',
        anamnesis: '',
        physicalExamination: '',
        triage: '',
        lifestyleHabits: {
            alcoholConsumption: false,
            smoker: false,
            obesity: false,
            diabetes: false,
            drugUser: false,
            physicalActivity: false,
        },
        physicalInspection: {
            isFaceSinusPalpationHurtful: false,
            nasalSecretion: {
                type: '',
                isFetid: false,
                quantity: '',
            },
            nasalItching: '',
            sneezing: '',
            chestType: '',
            respiratoryOrCardiacSigns: '',
            nasalInspection: '',  
        },
        VitalSigns: {
            heartRate: 0,
            respiratoryRate: 0,
            bloodPressure: {
                systolic: 0,
                diastolic: 0,
            },
            temperature: 0,
            oxygenSaturation: 0,
        },
        pneumofunctionalAssessment: {
            peakFlow: {
                firstMeasurement: 0,
                secondMeasurement: 0,
                thirdMeasurement: 0,
            },
            manovacuometry: {
                pemax: {
                    firstMeasurement: 0,
                    secondMeasurement: 0,
                    thirdMeasurement: 0,
                },
                pimax: {
                    firstMeasurement: 0,
                    secondMeasurement: 0,
                    thirdMeasurement: 0,
                },
            },
        },
        cardiofunctionalAssessment: {
            bmi: 0,
            abdominalPerimeter: 0,
            waistHipRatio: 0,
            bioimpedance: {
                bodyFat: 0,
                visceralFat: 0,
                muscleMassPercentage: 0,
            },
            adipometry: {
                skinfoldMeasurements: {
                    bicipital: 0,
                    tricipital: 0,
                    subscapular: 0,
                    abdominal: 0,
                },
            },
        },
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const handleSave = async () => {
        const dataToSend = {
            ...record,
        };

        try {
            const token = localStorage.getItem("access_token");
            const recordId = localStorage.getItem('currentRecordId');
            await api.put(`/cardiorespiratory-record/${recordId}`, dataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            router.push('/Medico/Fichas');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Erro ao salvar registro:', error.response.data);
                console.log('Erros de validação:', error.response.data.errors); // Log dos erros de validação
                setError(`Erro ao salvar as alterações: ${error.response.data.message}`);
            } else {
                console.error('Erro ao salvar registro:', error);
                setError('Erro ao salvar as alterações.');
            }
        }
    };

    useEffect(() => {
        fetchRecordData();
    }, []);

    return (
        <PrivateRoute requiredUserType='clinician'>
            <div className="flex flex-col min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <NavbarDoctor />
                <h2 className="font-bold text-4xl text-gray-700 pt-8">Editar Registro Cardio</h2>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                {loading ? (
                    <div className="flex justify-center text-lg text-gray-500 items-center h-64">
                        <span>Carregando...</span>
                    </div>
                ) : (
                    <div className="grid gap-8 pb-8">

                        {/* Diagnóstico Médico */}
                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <label className="text-2xl block text-gray-700 font-medium pb-6">Diagnóstico Médico</label>
                            <textarea
                                value={record.medicalDiagnosis}
                                onChange={(e) => setRecord({ ...record, medicalDiagnosis: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Digite o Diagnóstico Médico"
                            />
                        </div>

                        {/* Anamnese */}
                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <label className="text-2xl block text-gray-700 font-medium pb-6">
                                Anamnese
                            </label>
                            <textarea
                                value={record.anamnesis}
                                onChange={(e) => setRecord({ ...record, anamnesis: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Digite a Anamnese"
                            />
                        </div>

                        {/* Exame Físico */}
                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <label className="text-2xl block text-gray-700 font-medium pb-6">Exame Físico</label>
                            <textarea
                                value={record.physicalExamination}
                                onChange={(e) => setRecord({ ...record, physicalExamination: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight 
                                focus:outline-none focus:shadow-outline"
                                placeholder="Digite o Exame Físico"
                            />
                        </div>

                        {/* Triage */}
                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <label className="text-2xl block text-gray-700 font-medium pb-6">Triage</label>
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

                        {/* Inspeção Física */}
                        <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                            <h3 className="text-2xl block text-gray-700 font-medium pb-6">Inspeção Física</h3>

                            <label className="flex gap-4 text-base font-normal text-gray-800">
                                <input
                                    type="checkbox"
                                    checked={record.physicalInspection.isFaceSinusPalpationHurtful}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        physicalInspection: {
                                            ...record.physicalInspection,
                                            isFaceSinusPalpationHurtful: e.target.checked
                                        }
                                    })}
                                />
                                Palpação Facial dolorosa
                            </label>
                            <label className="flex gap-2 text-base font-normal text-gray-800">Secreção Nasal</label>
                            <input
                                type="text"
                                value={record.physicalInspection.nasalSecretion.type}
                                onChange={(e) => setRecord({
                                    ...record,
                                    physicalInspection: {
                                        ...record.physicalInspection,
                                        nasalSecretion: {
                                            ...record.physicalInspection.nasalSecretion,
                                            type: e.target.value
                                        }
                                    }
                                })}
                                placeholder="Tipo de Secreção Nasal"
                                className="border rounded-md p-2"
                            />
                            <label className="flex gap-2 text-base font-normal text-gray-800">
                                <input
                                    type="checkbox"
                                    checked={record.physicalInspection.nasalSecretion.isFetid}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        physicalInspection: {
                                            ...record.physicalInspection,
                                            nasalSecretion: {
                                                ...record.physicalInspection.nasalSecretion,
                                                isFetid: e.target.checked
                                            }
                                        }
                                    })}
                                />
                                Secreção Fetida
                            </label>

                            <label className="flex gap-2 text-base font-normal text-gray-800">Quantidade de Secreção</label>
                            <input
                                type="text"
                                value={record.physicalInspection.nasalSecretion.quantity}
                                onChange={(e) => setRecord({
                                    ...record,
                                    physicalInspection: {
                                        ...record.physicalInspection,
                                        nasalSecretion: {
                                            ...record.physicalInspection.nasalSecretion,
                                            quantity: e.target.value
                                        }
                                    }
                                })}
                                placeholder="Quantidade de Secreção Nasal"
                                className="border rounded-md p-2"
                            />
                            <label className="flex gap-2 text-base font-normal text-gray-800">Coceira Nasal</label>
                            <input
                                type="text"
                                value={record.physicalInspection.nasalItching}
                                onChange={(e) => setRecord({
                                    ...record,
                                    physicalInspection: {
                                        ...record.physicalInspection,
                                        nasalItching: e.target.value
                                    }
                                })}
                                placeholder="Coceira Nasal"
                                className="border rounded-md p-2"
                            />
                            <label className="flex gap-2 text-base font-normal text-gray-800">Espirros</label>
                            <input
                                type="text"
                                value={record.physicalInspection.sneezing}
                                onChange={(e) => setRecord({
                                    ...record,
                                    physicalInspection: {
                                        ...record.physicalInspection,
                                        sneezing: e.target.value
                                    }
                                })}
                                placeholder="Espirros"
                                className="border rounded-md p-2"
                            />
                            <label className="flex gap-2 text-base font-normal text-gray-800">Tipo de Tórax</label>
                            <input
                                type="text"
                                value={record.physicalInspection.chestType}
                                onChange={(e) => setRecord({
                                    ...record,
                                    physicalInspection: {
                                        ...record.physicalInspection,
                                        chestType: e.target.value
                                    }
                                })}
                                placeholder="Tipo de Tórax"
                                className="border rounded-md p-2"
                            />
                            <label className="flex gap-2 text-base font-normal text-gray-800">Sinais Respiratórios ou Cardíacos</label>
                            <input
                                type="text"
                                value={record.physicalInspection.respiratoryOrCardiacSigns}
                                onChange={(e) => setRecord({
                                    ...record,
                                    physicalInspection: {
                                        ...record.physicalInspection,
                                        respiratoryOrCardiacSigns: e.target.value
                                    }
                                })}
                                placeholder="Sinais Respiratórios ou Cardíacos"
                                className="border rounded-md p-2"
                            />
                        </div>

                        {/* Sinais Vitais */}
                        <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                            <h3 className="text-2xl block text-gray-700 font-medium pb-6">Sinais Vitais</h3>
                            <div>
                                <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Frequência Cardíaca</label>
                                <input
                                    type="number"
                                    value={record.VitalSigns?.heartRate || ''}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        VitalSigns: {
                                            ...record.VitalSigns,
                                            heartRate: e.target.value ? Number(e.target.value) : 0
                                        }
                                    })}
                                    placeholder="Digite a Frequência Cardíaca"
                                    className="border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Frequência Respiratória</label>
                                <input
                                    type="number"
                                    value={record.VitalSigns?.respiratoryRate || ''}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        VitalSigns: {
                                            ...record.VitalSigns,
                                            respiratoryRate: e.target.value ? Number(e.target.value) : 0
                                        }
                                    })}
                                    placeholder="Digite a Frequência Respiratória"
                                    className="border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Pressão Arterial (Sistólica)</label>
                                <input
                                    type="number"
                                    value={record.VitalSigns?.bloodPressure?.systolic || ''} // Verificação adicionada
                                    onChange={(e) => setRecord({
                                        ...record,
                                        VitalSigns: {
                                            ...record.VitalSigns,
                                            bloodPressure: {
                                                ...record.VitalSigns.bloodPressure, // Verificação adicionada
                                                systolic: e.target.value ? Number(e.target.value) : 0
                                            },
                                        },
                                    })}
                                    className="border rounded-md p-2"
                                    placeholder="Pressão Arterial Sistólica"
                                />
                            </div>
                            <div>
                                <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Pressão Arterial (Diastólica)</label>
                                <input
                                    type="number"
                                    value={record.VitalSigns?.bloodPressure?.diastolic || ''}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        VitalSigns: {
                                            ...record.VitalSigns,
                                            bloodPressure: {
                                                ...record.VitalSigns.bloodPressure,
                                                diastolic: e.target.value ? Number(e.target.value) : 0
                                            }
                                        }
                                    })}
                                    placeholder="Pressão Arterial Diastólica"
                                    className="border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Temperatura Corporal</label>
                                <input
                                    type="number"
                                    value={record.VitalSigns?.temperature || ''}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        VitalSigns: {
                                            ...record.VitalSigns,
                                            temperature: e.target.value ? Number(e.target.value) : 0
                                        }
                                    })}
                                    placeholder="Digite a Temperatura Corporal"
                                    className="border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Saturação do Oxigênio</label>
                                <input
                                    type="number"
                                    value={record.VitalSigns?.oxygenSaturation || ''}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        VitalSigns: {
                                            ...record.VitalSigns,
                                            oxygenSaturation: e.target.value ? Number(e.target.value) : 0
                                        }
                                    })}
                                    placeholder="Digite a Temperatura Corporal"
                                    className="border rounded-md p-2"
                                />
                            </div>
                            {/* Adicione outros campos de sinais vitais aqui, conforme necessário */}
                        </div>

                        {/* Avaliação Pneumofuncional */}
                        <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                            <h3 className="text-2xl block text-gray-700 font-medium pb-6">Avaliação Pneumofuncional</h3>
                            
                                <label className="flex gap-2 text-base font-semibold text-gray-800 mb-2">Fluxo Pic</label>
                                <div>
                                <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Primeira Medida do Fluxo Pic</label>
                                <input
                                    type="number"
                                    value={record.pneumofunctionalAssessment.peakFlow.firstMeasurement || ''}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        pneumofunctionalAssessment: {
                                            ...record.pneumofunctionalAssessment,
                                            peakFlow: {
                                                ...record.pneumofunctionalAssessment.peakFlow,
                                                firstMeasurement: e.target.value ? Number(e.target.value) : 0
                                            }
                                        }
                                    })}
                                    placeholder="Digite a Primeira Medida do Fluxo Pic"
                                    className="border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Segunda Medida do Fluxo Pic</label>
                                <input
                                    type="number"
                                    value={record.pneumofunctionalAssessment.peakFlow.secondMeasurement || ''}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        pneumofunctionalAssessment: {
                                            ...record.pneumofunctionalAssessment,
                                            peakFlow: {
                                                ...record.pneumofunctionalAssessment.peakFlow,
                                                secondMeasurement: e.target.value ? Number(e.target.value) : 0
                                            }
                                        }
                                    })}
                                    placeholder="Digite a Segunda Medida do Fluxo Pic"
                                    className="border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Terceira Medida do Fluxo Pic</label>
                                <input
                                    type="number"
                                    value={record.pneumofunctionalAssessment.peakFlow.thirdMeasurement || ''}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        pneumofunctionalAssessment: {
                                            ...record.pneumofunctionalAssessment,
                                            peakFlow: {
                                                ...record.pneumofunctionalAssessment.peakFlow,
                                                thirdMeasurement: e.target.value ? Number(e.target.value) : 0
                                            }
                                        }
                                    })}
                                    placeholder="Digite a Terceira Medida do Fluxo Pic"
                                    className="border rounded-md p-2"
                                />
                            </div>
                                <label className="flex gap-2 text-base font-semibold text-gray-800 mb-2">Manovacuometria</label>
                                <label className="flex gap-2 text-base font-semibold text-gray-800 mb-2">Pressão Expiratória Máxima</label>

                                <div>
                                    <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Primeira Medição</label>
                                    <input
                                        type="number"
                                        value={record.pneumofunctionalAssessment.manovacuometry.pemax.firstMeasurement || ''}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            pneumofunctionalAssessment: {
                                                ...record.pneumofunctionalAssessment,
                                                manovacuometry: {
                                                    ...record.pneumofunctionalAssessment.manovacuometry,
                                                    pemax: {
                                                        ...record.pneumofunctionalAssessment.manovacuometry.pemax,
                                                        firstMeasurement: e.target.value ? Number(e.target.value) : 0
                                                    }
                                                }
                                            }
                                        })}
                                        placeholder="Digite a Primeira Medição"
                                        className="border rounded-md p-2"
                                    />
                                </div>
                                <div>
                                    <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Segunda Medição</label>
                                    <input
                                        type="number"
                                        value={record.pneumofunctionalAssessment.manovacuometry.pemax.secondMeasurement || ''}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            pneumofunctionalAssessment: {
                                                ...record.pneumofunctionalAssessment,
                                                manovacuometry: {
                                                    ...record.pneumofunctionalAssessment.manovacuometry,
                                                    pemax: {
                                                        ...record.pneumofunctionalAssessment.manovacuometry.pemax,
                                                        secondMeasurement: e.target.value ? Number(e.target.value) : 0
                                                    }
                                                }
                                            }
                                        })}
                                        placeholder="Digite a Segunda Medição"
                                        className="border rounded-md p-2"
                                    />
                                </div>
                                <div>
                                    <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Terceira Medição</label>
                                    <input
                                        type="number"
                                        value={record.pneumofunctionalAssessment.manovacuometry.pemax.thirdMeasurement || ''}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            pneumofunctionalAssessment: {
                                                ...record.pneumofunctionalAssessment,
                                                manovacuometry: {
                                                    ...record.pneumofunctionalAssessment.manovacuometry,
                                                    pemax: {
                                                        ...record.pneumofunctionalAssessment.manovacuometry.pemax,
                                                        thirdMeasurement: e.target.value ? Number(e.target.value) : 0
                                                    }
                                                }
                                            }
                                        })}
                                        placeholder="Digite a Terceira Medição"
                                        className="border rounded-md p-2"
                                    />
                                </div>

                                <label className="flex gap-2 text-base font-semibold text-gray-800 mb-2">Pressão Inspiratória Máxima</label>

                                <div>
                                    <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Primeira Medição</label>
                                    <input
                                        type="number"
                                        value={record.pneumofunctionalAssessment.manovacuometry.pimax.firstMeasurement || ''}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            pneumofunctionalAssessment: {
                                                ...record.pneumofunctionalAssessment,
                                                manovacuometry: {
                                                    ...record.pneumofunctionalAssessment.manovacuometry,
                                                    pimax: {
                                                        ...record.pneumofunctionalAssessment.manovacuometry.pimax,
                                                        firstMeasurement: e.target.value ? Number(e.target.value) : 0
                                                    }
                                                }
                                            }
                                        })}
                                        placeholder="Digite a Primeira Medição"
                                        className="border rounded-md p-2"
                                    />
                                </div>
                                <div>
                                    <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Segunda Medição</label>
                                    <input
                                        type="number"
                                        value={record.pneumofunctionalAssessment.manovacuometry.pimax.secondMeasurement || ''}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            pneumofunctionalAssessment: {
                                                ...record.pneumofunctionalAssessment,
                                                manovacuometry: {
                                                    ...record.pneumofunctionalAssessment.manovacuometry,
                                                    pimax: {
                                                        ...record.pneumofunctionalAssessment.manovacuometry.pimax,
                                                        secondMeasurement: e.target.value ? Number(e.target.value) : 0
                                                    }
                                                }
                                            }
                                        })}
                                        placeholder="Digite a Segunda Medição"
                                        className="border rounded-md p-2"
                                    />
                                </div>
                                <div>
                                    <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Terceira Medição</label>
                                    <input
                                        type="number"
                                        value={record.pneumofunctionalAssessment.manovacuometry.pimax.thirdMeasurement || ''}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            pneumofunctionalAssessment: {
                                                ...record.pneumofunctionalAssessment,
                                                manovacuometry: {
                                                    ...record.pneumofunctionalAssessment.manovacuometry,
                                                    pimax: {
                                                        ...record.pneumofunctionalAssessment.manovacuometry.pimax,
                                                        thirdMeasurement: e.target.value ? Number(e.target.value) : 0
                                                    }
                                                }
                                            }
                                        })}
                                        placeholder="Digite a Terceira Medição"
                                        className="border rounded-md p-2"
                                    />
                                </div>
                                
                                
                                
                                
                                {/* Adicione outros campos de avaliação pneumofuncional aqui, conforme necessário */}
                            </div>
                            
                        {/* Avaliação Cardiofuncional */}
                            <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                                <h3 className="text-2xl block text-gray-700 font-medium pb-6">Avaliação Cardiofuncional</h3>
                            <div>
                                    <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">BMI</label>
                                <input
                                    type="number"
                                    value={record.cardiofunctionalAssessment.bmi || ''}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        cardiofunctionalAssessment: {
                                            ...record.cardiofunctionalAssessment,
                                            bmi: e.target.value ? Number(e.target.value) : 0
                                        }
                                    })}
                                    placeholder="Digite o BMI"
                                    className="border rounded-md p-2"
                                />
                            </div>
                            <div>
                                    <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Capacidade Pulmonar</label>
                                <input
                                    type="number"
                                    value={record.cardiofunctionalAssessment.abdominalPerimeter || ''}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        cardiofunctionalAssessment: {
                                            ...record.cardiofunctionalAssessment,
                                            abdominalPerimeter: e.target.value ? Number(e.target.value) : 0
                                        }
                                    })}
                                    placeholder="Digite a Capacidade Pulmonar"
                                    className="border rounded-md p-2"
                                />
                            </div>
                            <div>
                                    <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Cintura</label>
                                <input
                                    type="number"
                                    value={record.cardiofunctionalAssessment.waistHipRatio || ''}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        cardiofunctionalAssessment: {
                                            ...record.cardiofunctionalAssessment,
                                            waistHipRatio: e.target.value ? Number(e.target.value) : 0
                                        }
                                    })}
                                    placeholder="Digite a Capacidade Pulmonar"
                                    className="border rounded-md p-2"
                                />
                            </div>
                            <div>
                                    <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Percentual de Gordura Corporal</label>
                                <input
                                    type="number"
                                    value={record.cardiofunctionalAssessment.bioimpedance.bodyFat || ''}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        cardiofunctionalAssessment: {
                                            ...record.cardiofunctionalAssessment,
                                            bioimpedance: {
                                                ...record.cardiofunctionalAssessment.bioimpedance,
                                                bodyFat: e.target.value ? Number(e.target.value) : 0
                                            }
                                        }
                                    })}
                                    placeholder="Digite o Percentual de Gordura Corporal"
                                    className="border rounded-md p-2"
                                />
                            </div>

                            <div>
                                    <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Gordura Visceral</label>
                                <input
                                    type="number"
                                    value={record.cardiofunctionalAssessment.bioimpedance.visceralFat || ''}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        cardiofunctionalAssessment: {
                                            ...record.cardiofunctionalAssessment,
                                            bioimpedance: {
                                                ...record.cardiofunctionalAssessment.bioimpedance,
                                                visceralFat: e.target.value ? Number(e.target.value) : 0
                                            }
                                        }
                                    })}
                                    placeholder="Digite a Gordura Visceral"
                                    className="border rounded-md p-2"
                                />
                            </div>

                            <div>
                                    <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Porcentagem de Massa Muscular</label>
                                <input
                                    type="number"
                                    value={record.cardiofunctionalAssessment.bioimpedance.muscleMassPercentage || ''}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        cardiofunctionalAssessment: {
                                            ...record.cardiofunctionalAssessment,
                                            bioimpedance: {
                                                ...record.cardiofunctionalAssessment.bioimpedance,
                                                muscleMassPercentage: e.target.value ? Number(e.target.value) : 0
                                            }
                                        }
                                    })}
                                    placeholder="Digite a Porcentagem de Massa Muscular"
                                    className="border rounded-md p-2"
                                />
                            </div>

                            <div>
                                    <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Medida Bicipital</label>
                                <input
                                    type="number"
                                    value={record.cardiofunctionalAssessment.adipometry.skinfoldMeasurements.bicipital || ''}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        cardiofunctionalAssessment: {
                                            ...record.cardiofunctionalAssessment,
                                            adipometry: {
                                                ...record.cardiofunctionalAssessment.adipometry,
                                                skinfoldMeasurements: {
                                                    ...record.cardiofunctionalAssessment.adipometry.skinfoldMeasurements,
                                                    bicipital: e.target.value ? Number(e.target.value) : 0
                                                }
                                            }
                                        }
                                    })}
                                    placeholder="Digite a Medida Bicipital"
                                    className="border rounded-md p-2"
                                />
                            </div>

                            <div>
                                    <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Medida Tricipital</label>
                                <input
                                    type="number"
                                    value={record.cardiofunctionalAssessment.adipometry.skinfoldMeasurements.tricipital || ''}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        cardiofunctionalAssessment: {
                                            ...record.cardiofunctionalAssessment,
                                            adipometry: {
                                                ...record.cardiofunctionalAssessment.adipometry,
                                                skinfoldMeasurements: {
                                                    ...record.cardiofunctionalAssessment.adipometry.skinfoldMeasurements,
                                                    tricipital: e.target.value ? Number(e.target.value) : 0
                                                }
                                            }
                                        }
                                    })}
                                    placeholder="Digite a Medida Tricipital"
                                    className="border rounded-md p-2"
                                />
                            </div>

                            <div>
                                    <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Medida Subescapular</label>
                                <input
                                    type="number"
                                    value={record.cardiofunctionalAssessment.adipometry.skinfoldMeasurements.subscapular || ''}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        cardiofunctionalAssessment: {
                                            ...record.cardiofunctionalAssessment,
                                            adipometry: {
                                                ...record.cardiofunctionalAssessment.adipometry,
                                                skinfoldMeasurements: {
                                                    ...record.cardiofunctionalAssessment.adipometry.skinfoldMeasurements,
                                                    subscapular: e.target.value ? Number(e.target.value) : 0
                                                }
                                            }
                                        }
                                    })}
                                    placeholder="Digite a Medida Subescapular"
                                    className="border rounded-md p-2"
                                />
                            </div>

                            <div>
                                    <label className="flex gap-2 text-base font-normal text-gray-800 mb-2">Medida Abdominal</label>
                                <input
                                    type="number"
                                    value={record.cardiofunctionalAssessment.adipometry.skinfoldMeasurements.abdominal || ''}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        cardiofunctionalAssessment: {
                                            ...record.cardiofunctionalAssessment,
                                            adipometry: {
                                                ...record.cardiofunctionalAssessment.adipometry,
                                                skinfoldMeasurements: {
                                                    ...record.cardiofunctionalAssessment.adipometry.skinfoldMeasurements,
                                                    abdominal: e.target.value ? Number(e.target.value) : 0
                                                }
                                            }
                                        }
                                    })}
                                    placeholder="Digite a Medida Abdominal"
                                    className="border rounded-md p-2"
                                />
                            </div>


                        </div>

                        {/* Botões de ação */}
                            <div className="flex w-full items-baseline justify-end gap-4 mt-4 pr-8">
                            <CancelButton onClick={() => router.push('/Medico/Fichas')} />
                            <SaveButton onClick={handleSave} />
                        </div>
                    </div>
                )}
                <Footer />
            </div>
        </PrivateRoute>
    );


}
