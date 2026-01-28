import React from 'react';
import { BaseComponentProps } from '../../lib/types';
import Input from '../ui/Input';
import { Text } from '../ui/Typography';

export interface FormFieldProps extends BaseComponentProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpText?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  error,
  helpText,
  className = '',
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        error={error}
      />

      {helpText && (
        <Text variant="muted" size="sm" className="mt-1">
          {helpText}
        </Text>
      )}

      {error && (
        <Text variant="destructive" size="sm" className="mt-1">
          {error}
        </Text>
      )}
    </div>
  );
};

export default FormField;