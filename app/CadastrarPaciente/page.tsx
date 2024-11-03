'use client';
import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ButtonOne from '../components/ButtonOne';
import { useRouter } from 'next/navigation';
import HeaderBar from '../components/Header';
import FooterBar from '../components/Footer';
import Input from "@/app/components/InputText";

export default function CadastrarPaciente() {
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cpf, setCpf] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedBirthDate = new Date(birthDate).toISOString();

    const newPatient = {
      name,
      surname,
      gender,
      birthDate: formattedBirthDate, // Usando a data formatada
      cpf,
      phoneNumber,
      address,
      city,
      state,
      email,
      password,
    };

    try {
      const response = await api.post(`/${user}s`, newPatient);
      setMessage('Paciente registrado com sucesso!');
      console.log('Paciente registrado com sucesso!', response.data);
      // Limpa os campos após o registro
      setName('');
      setSurname('');
      setGender('');
      setBirthDate('');
      setCpf('');
      setPhoneNumber('');
      setAddress('');
      setCity('');
      setState('');
      setEmail('');
      setPassword('');

      router.push('/Login');
    } catch (error) {
      setMessage('Erro ao registrar o paciente. Por favor, tente novamente.');
      console.error(error);
    }
  };

  return (
    <div className="h-screen p-8 pb-20 sm:p-20 bg-gray-100 mx-auto overflow-y-auto">
      <HeaderBar/>
      <h1 className="font-bold text-4xl text-gray-700 pb-6 mb-6">Registrar Paciente</h1>
      <form onSubmit={handleSubmit} className="space-y-4 pb-8">
        <div>
          <Input
            label="Nome"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            label="Sobrenome"
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-lg block text-gray-700 font-medium mb-2">Gênero</label>
          <select
            className="text-lg block text-gray-800 font-medium mb-2 p-2"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecione
            </option>
            <option value="male">Masculino</option>
            <option value="female">Feminino</option>
            <option value="outro">Outro</option>
            <option value="prefiro_nao_dizer">Prefiro não dizer</option>
          </select>
        </div>
        <div>
          <Input
            label="Data de Nascimento"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            label="CPF"
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            label="Número de Telefone"
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            label="Endereço"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            label="Cidade"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            label="Estado"
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </div>

        <div>
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <ButtonOne texto='Registrar' type='submit' />
        {message && <p className="mt-4 text-center">{message}</p>}
      </form>
      <FooterBar/>
    </div>
  );
}
