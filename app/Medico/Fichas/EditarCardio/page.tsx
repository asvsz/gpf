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
            nasalInspection: '',  // Inicializando nasalInspection
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

            alert("Registro salvo com sucesso!");
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
                <h2 className="text-3xl font-bold">Editar Registro Cardio</h2>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <span>Carregando...</span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 mb-10">

                        {/* Diagnóstico Médico */}
                        <div>
                            <label className="block font-semibold">Diagnóstico Médico</label>
                            <textarea
                                value={record.medicalDiagnosis}
                                onChange={(e) => setRecord({ ...record, medicalDiagnosis: e.target.value })}
                                className="border rounded-md p-2"
                                placeholder="Digite o Diagnóstico Médico"
                            />
                        </div>

                        {/* Anamnese */}
                        <div>
                            <label className="block font-semibold">Anamnese</label>
                            <textarea
                                value={record.anamnesis}
                                onChange={(e) => setRecord({ ...record, anamnesis: e.target.value })}
                                className="border rounded-md p-2"
                                placeholder="Digite a Anamnese"
                            />
                        </div>

                        {/* Exame Físico */}
                        <div>
                            <label className="block font-semibold">Exame Físico</label>
                            <textarea
                                value={record.physicalExamination}
                                onChange={(e) => setRecord({ ...record, physicalExamination: e.target.value })}
                                className="border rounded-md p-2"
                                placeholder="Digite o Exame Físico"
                            />
                        </div>

                        {/* Triage */}
                        <div>
                            <label className="block font-semibold">Triage</label>
                            <select
                                value={record.triage}
                                onChange={(e) => setRecord({ ...record, triage: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            >
                                <option value="" disabled>Selecione</option>
                                <option value="green">Verde</option>
                                <option value="yellow">Amarelo</option>
                                <option value="red">Vermelho</option>
                            </select>
                        </div>

                        {/* Hábitos de Vida */}
                        <div className="flex gap-4">
                            {Object.entries(record.lifestyleHabits).map(([key, value]) => (
                                <label key={key}>
                                    <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={(e) => setRecord({
                                            ...record,
                                            lifestyleHabits: {
                                                ...record.lifestyleHabits,
                                                [key]: e.target.checked
                                            }
                                        })}
                                    />
                                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                </label>
                            ))}
                        </div>

                        {/* Inspeção Física */}
                        <div>
                            <h3 className="font-semibold">Inspeção Física</h3>
                            <label>
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
                            <div>
                                <label className="block font-semibold">Inspeção Nasal</label>
                                <textarea
                                    value={record.physicalInspection.nasalInspection}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        physicalInspection: {
                                            ...record.physicalInspection,
                                            nasalInspection: e.target.value
                                        }
                                    })}
                                    className="border rounded-md p-2"
                                    placeholder="Inspeção Nasal"
                                />
                            </div>

                            {/* Campos adicionais de Inspeção Física */}
                            <label className="block font-semibold">Secreção Nasal</label>
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
                            <label className="block font-semibold">Secreção Fetida?</label>
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
                            <label className="block">Quantidade de Secreção</label>
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
                            <label className="block">Coceira Nasal</label>
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
                            <label className="block">Espirros</label>
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
                            <label className="block">Tipo de Tórax</label>
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
                            <label className="block">Sinais Respiratórios ou Cardíacos</label>
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
                        <div>
                            <h3 className="font-semibold">Sinais Vitais</h3>
                            <div>
                                <label className="block">Frequência Cardíaca</label>
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
                                <label className="block">Frequência Respiratória</label>
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
                                <label className="block">Pressão Arterial (Sistólica)</label>
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
                                <label className="block">Pressão Arterial (Diastólica)</label>
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
                                <label className="block">Temperatura Corporal</label>
                                <input
                                    type="number"
                                    value={record.VitalSigns?.temperature|| ''}
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
                            </div>                 <div>
                                <label className="block">Saturação do Oxigênio</label>
                                <input
                                    type="number"
                                    value={record.VitalSigns?.oxygenSaturation|| ''}
                                    onChange={(e) => setRecord({
                                        ...record,
                                        VitalSigns: {
                                            ...record.VitalSigns,
                                            oxygenSaturation    : e.target.value ? Number(e.target.value) : 0
                                        }
                                    })}
                                    placeholder="Digite a Temperatura Corporal"
                                    className="border rounded-md p-2"
                                />
                            </div>
                            {/* Adicione outros campos de sinais vitais aqui, conforme necessário */}
                        </div>

                        {/* Avaliação Pneumofuncional */}
                        <div>
                            <h3 className="font-semibold">Avaliação Pneumofuncional</h3>
                            <div>
                                <label className="block">Primeira Medida do Fluxo Pic</label>
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
                                <label className="block">Segunda Medida do Fluxo Pic</label>
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
                            {/* Adicione outros campos de avaliação pneumofuncional aqui, conforme necessário */}
                        </div>

                        {/* Avaliação Cardiofuncional */}
                        <div>
                            <h3 className="font-semibold">Avaliação Cardiofuncional</h3>
                            <div>
                                <label className="block">IMC</label>
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
                                    placeholder="Digite o IMC"
                                    className="border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block">Capacidade Pulmonar</label>
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
                                <label className="block">Cintura</label>
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
                                <label className="block">Percentual de Gordura Corporal</label>
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
                                <label className="block">Gordura Visceral</label>
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
                                <label className="block">Porcentagem de Massa Muscular</label>
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
                                <label className="block">Medida Bicipital</label>
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
                                <label className="block">Medida Tricipital</label>
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
                                <label className="block">Medida Subescapular</label>
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
                                <label className="block">Medida Abdominal</label>
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
                        <div className="flex gap-4 mt-6">
                            <CancelButton onClick={() => router.push('/Medico/Fichas')}/>
                            <SaveButton onClick={handleSave}/>
                        </div>
                    </div>
                )}
                <Footer/>
            </div>
        </PrivateRoute>
    );


}
