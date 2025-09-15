import React from 'react';

type InputProps = {
  legend: string;
  name: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input: React.FC<InputProps> = ({
  legend,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
}) => {
  return (
    <fieldset className="fieldset w-full text-center">
      <legend className="fieldset-legend">{legend}</legend>
      <input
        name={name}
        type={type}
        className="input w-full"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </fieldset>
  );
};

export default Input;
