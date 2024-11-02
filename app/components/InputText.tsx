import React from "react";

type InputProps = {
  label: string;
  type: string;
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Tipo do evento especificado aqui
  placeholder?: string;
  required?: boolean;
};


export default function Input({
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
}: InputProps) {
  return (
    <div className="mb-4">
      <label className="text-lg block text-gray-700 font-medium mb-2" htmlFor={label}>
        {label}
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id={label}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
