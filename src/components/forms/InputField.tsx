import type { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export function InputField({ label, id, className = '', ...props }: InputFieldProps) {
  return (
    <label htmlFor={id} className="field">
      <span className="field__label">{label}</span>
      <input id={id} className={`field__input ${className}`.trim()} {...props} />
    </label>
  );
}
