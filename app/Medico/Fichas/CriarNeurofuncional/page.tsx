// app/Medico/Fichas/CriarNeurofuncional/page.tsx
'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '@/app/context/AuthContext'; // Certifique-se de que o contexto de autenticação está corretamente configurado
import { useFetchPaciente } from '@/app/hooks/useFetchPaciente'; // Importe o hook personalizado
import api from '@/app/services/api';
import NavbarDoctor from "@/app/components/NavbarDoctor";
import Footer from "@/app/components/Footer"; // Importe seu serviço de API

interface Paciente {
    id: string;
    name: string;
    surname: string;
    cpf: string;
}

const CriarNeurofuncional = () => {
    const { clinicianId } = useAuth(); // Pegando o clinicianId do contexto
    const [pacientes, setPacientes] = useState<Paciente[]>([]); // Lista de pacientes
    const [cpf, setCpf] = useState(''); // Armazena o CPF digitado
    const [patientId, setPatientId] = useState<string | null>(null); // Armazena o ID do paciente encontrado
    const [error, setError] = useState(''); // Para exibir erros

    // Campos do formulário
    const [profession, setProfession] = useState('');
    const [emergencyContactEmail, setEmergencyContactEmail] = useState('');
    const [emergencyContactNumber, setEmergencyContactNumber] = useState('');
    const [maritalStatus, setMaritalStatus] = useState('');
    const [height, setHeight] = useState<number | ''>('');
    const [weight, setWeight] = useState<number | ''>('');
    const [allergies, setAllergies] = useState<string[]>(['']); // Inicializa com um campo
    const [medicationsInUse, setMedicationsInUse] = useState<string[]>(['']); // Inicializa com um campo
    const [diagnosis, setDiagnosis] = useState<string[]>(['']); // Inicializa com um campo

    // Usar useEffect para buscar a lista de pacientes quando o componente é montado
    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await api.get('/patients', { // Altere a URL conforme necessário
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPacientes(response.data.patients); // Assume que a resposta contém { patients: Array }
            } catch (error) {
                console.error('Erro ao buscar pacientes:', error);
                setError('Erro ao buscar pacientes.');
            }
        };

        fetchPacientes(); // Chama a função para buscar pacientes
    }, []);

    const paciente = useFetchPaciente(patientId); // Utiliza o hook para buscar o paciente pelo patientId

    // Função para buscar o paciente pelo CPF na lista carregada
    const handleCpfSubmit = () => {
        if (pacientes.length > 0) {
            const matchedPatient = pacientes.find((p) => p.cpf === cpf);
            if (matchedPatient) {
                setPatientId(matchedPatient.id); // Armazena o ID do paciente encontrado
            } else {
                alert('Paciente não encontrado!');
            }
        } else {
            console.error('Lista de pacientes está vazia:', pacientes);
            setError('Lista de pacientes não carregada.');
        }
    };

    // Função para criar a ficha neurofuncional
    const handleCreateFicha = async () => {
        if (!patientId || !clinicianId) {
            alert('Paciente ou clínico não encontrado.');
            return;
        }

        const url = `/neurofunctional-record/patient-id/${patientId}/clinician-id/${clinicianId}`;

        const body = {
            universalMedicalRecord: {
                patientId: patientId,
                profession: profession,
                emergencyContactEmail: emergencyContactEmail,
                emergencyContactNumber: emergencyContactNumber,
                maritalStatus: maritalStatus,
                height: height,
                weight: weight,
                allergies: allergies,
                medicationsInUse: medicationsInUse,
                diagnosis: diagnosis,
            },
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                alert('Ficha neurofuncional criada com sucesso!');
                // Resetar os campos do formulário após o sucesso
                setProfession('');
                setEmergencyContactEmail('');
                setEmergencyContactNumber('');
                setMaritalStatus('');
                setHeight('');
                setWeight('');
                setAllergies(['']);
                setMedicationsInUse(['']);
                setDiagnosis(['']);
            } else {
                alert('Erro ao criar a ficha neurofuncional.');
            }
        } catch (error) {
            console.error('Erro ao criar ficha neurofuncional:', error);
            alert('Erro ao criar a ficha.');
        }
    };

    // Função para adicionar novos campos de alergias, medicamentos e diagnósticos
    const addField = (setField: React.Dispatch<React.SetStateAction<string[]>>) => {
        setField((prev) => [...prev, '']); // Adiciona um novo campo vazio
    };

    return (
        <div className="flex flex-col min-h-screen p-8 pb-20 sm:p-20 font-[var(--font-geist-sans)]">
            <NavbarDoctor/>
            <div className="flex-grow flex flex-col gap-8 sm:items-start">
                <h1 className='text-2xl'>Criar Ficha Neurofuncional</h1>
                {/* Exibe erros se houver */}
                {error && <p style={{color: 'red'}}>{error}</p>}

                {/* Input para digitar o CPF */}
                <div className=''>
                    <label>
                        CPF do Paciente:
                        <input
                            type="text"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)} // Atualiza o CPF conforme é digitado
                            placeholder="Digite o CPF do paciente"
                        />
                    </label>
                    <button onClick={handleCpfSubmit}>Buscar Paciente</button>
                    {/* Submete a busca */}
                </div>

                {paciente && (
                    <div>
                        <p>Nome do Paciente: {paciente.name} {paciente.surname}</p>
                        <p>CPF: {paciente.cpf}</p>
                        {/* Adicionando campos do formulário */}
                        <div  className='flex flex-col gap-8'>
                            <h2 className='text-2xl'>Dados do Registro Médico Universal</h2>

                            <label>
                                Profissão:
                                <input
                                    type="text"
                                    value={profession}
                                    onChange={(e) => setProfession(e.target.value)}
                                    placeholder="Profissão do paciente"
                                />
                            </label>

                            <label>
                                Email de Contato de Emergência:
                                <input
                                    type="email"
                                    value={emergencyContactEmail}
                                    onChange={(e) => setEmergencyContactEmail(e.target.value)}
                                    placeholder="Email de contato de emergência"
                                />
                            </label>

                            <label>
                                Número de Contato de Emergência:
                                <input
                                    type="text"
                                    value={emergencyContactNumber}
                                    onChange={(e) => setEmergencyContactNumber(e.target.value)}
                                    placeholder="Número de contato de emergência"
                                />
                            </label>

                            <label>
                                Estado Civil:
                                <input
                                    type="text"
                                    value={maritalStatus}
                                    onChange={(e) => setMaritalStatus(e.target.value)}
                                    placeholder="Estado civil do paciente"
                                />
                            </label>

                            <label>
                                Altura (cm):
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(Number(e.target.value))}
                                    placeholder="Altura em centímetros"
                                />
                            </label>

                            <label>
                                Peso (kg):
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(Number(e.target.value))}
                                    placeholder="Peso em quilogramas"
                                />
                            </label>

                            <h3>Alergias:</h3>
                            {allergies.map((allergy, index) => (
                                <label key={index}>
                                    Alergia:
                                    <input
                                        type="text"
                                        value={allergy}
                                        onChange={(e) => {
                                            const newAllergies = [...allergies];
                                            newAllergies[index] = e.target.value;
                                            setAllergies(newAllergies);
                                        }}
                                    />
                                </label>
                            ))}
                            <button type="button" onClick={() => addField(setAllergies)}>Adicionar Alergia</button>

                            <h3>Medicamentos em Uso:</h3>
                            {medicationsInUse.map((medication, index) => (
                                <label key={index}>
                                    Medicamento:
                                    <input
                                        type="text"
                                        value={medication}
                                        onChange={(e) => {
                                            const newMedications = [...medicationsInUse];
                                            newMedications[index] = e.target.value;
                                            setMedicationsInUse(newMedications);
                                        }}
                                    />
                                </label>
                            ))}
                            <button type="button" onClick={() => addField(setMedicationsInUse)}>Adicionar Medicamento
                            </button>

                            <h3>Diagnóstico:</h3>
                            {diagnosis.map((diag, index) => (
                                <label key={index}>
                                    Diagnóstico:
                                    <input
                                        type="text"
                                        value={diag}
                                        onChange={(e) => {
                                            const newDiagnosis = [...diagnosis];
                                            newDiagnosis[index] = e.target.value;
                                            setDiagnosis(newDiagnosis);
                                        }}
                                    />
                                </label>
                            ))}
                            <button type="button" onClick={() => addField(setDiagnosis)}>Adicionar Diagnóstico</button>

                            <button onClick={handleCreateFicha}>Criar Ficha</button>
                            {/* Submete a criação da ficha */}
                        </div>
                    </div>
                )}
            </div>
            <Footer/>
        </div>

    );
};

export default CriarNeurofuncional;
