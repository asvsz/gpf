'use client';
import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ButtonOne from '../components/ButtonOne';
import { useRouter } from 'next/navigation';
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Input from "@/app/components/InputText";

export default function CadastrarMedico() {
  const { user } = useAuth();

  const router = useRouter()

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState('');
  const [occupation, setOccupation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newClinician = {
      name,
      surname,
      gender,
      occupation,
      phoneNumber,
      email,
      password,
    };

    try {
      const response = await api.post(`/${user}s`, newClinician);
      setMessage('Fisioterapeuta registrado com sucesso!');
      console.log('Fisioterapeuta registrado com sucesso!');
      // Clear fields after registration
      setName('');
      setSurname('');
      setGender('');
      setOccupation('');
      setPhoneNumber('');
      setEmail('');
      setPassword('');

      router.push('/Login')
    } catch (error) {
      setMessage('Erro ao registrar o fisioterapeuta. Por favor, tente novamente.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 flex flex-col bg-gray-100 mx-auto">
      <Header />
      <h1 className="font-bold text-4xl text-gray-700 pb-6 mb-6">Registrar Fisioterapeuta</h1>
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
            label="Especialização"
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
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
      <Footer />
    </div>
  );
}
