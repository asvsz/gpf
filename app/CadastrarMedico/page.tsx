'use client';
import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ButtonOne from '../components/ButtonOne';
import { useRouter } from 'next/navigation';

export default function CadastrarPaciente() {
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Registrar Fisioterapeuta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Sobrenome</label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Gênero</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
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
          <label className="block text-gray-700">Especialização</label>
          <input
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Número de Telefone</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <ButtonOne texto='Registrar' type='submit' />
        {message && <p className="mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
}
