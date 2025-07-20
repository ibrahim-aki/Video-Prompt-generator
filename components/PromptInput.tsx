
import React from 'react';

interface PromptInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  rows?: number;
  required?: boolean;
  children?: React.ReactNode;
}

const PromptInput: React.FC<PromptInputProps> = ({ id, label, value, onChange, placeholder, rows = 2, required = false, children }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="font-semibold text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="text-red-500 ltr:ml-1 rtl:mr-1">*</span>}
        </label>
        {children}
      </div>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-3 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 ease-in-out resize-y"
      />
    </div>
  );
};

export default PromptInput;