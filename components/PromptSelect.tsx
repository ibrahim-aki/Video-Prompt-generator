
import React from 'react';

interface PromptSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  children?: React.ReactNode;
}

const PromptSelect: React.FC<PromptSelectProps> = ({ id, label, value, onChange, options, placeholder, required = false, children }) => {
  // Check if the current value from state exists in the provided options.
  const valueExistsInOptions = options.some(opt => opt.value === value);

  // Create a mutable copy of the options to potentially add a new one.
  const displayOptions = [...options];

  // If the current value is not in the options list (e.g., from a creative AI generation),
  // add it to the list temporarily so it can be displayed as the selected option.
  // This prevents the dropdown from resetting to the placeholder.
  if (value && !valueExistsInOptions) {
    displayOptions.push({ value: value, label: value });
  }

  // Build the class string in a variable to avoid JSX parsing issues with complex strings.
  const selectClasses = [
    'w-full',
    'bg-slate-100 dark:bg-slate-800',
    'border border-slate-300 dark:border-slate-700',
    'rounded-md p-3',
    'text-slate-900 dark:text-slate-200',
    'focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500',
    'transition duration-200 ease-in-out',
    'appearance-none',
    'bg-no-repeat bg-origin-content pr-8',
    'bg-[right_0.5rem_center] bg-[length:1.5em_1.5em]',
    // Light mode arrow SVG
    `bg-[url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23334155' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")]`,
    // Dark mode arrow SVG
    `dark:bg-[url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")]`,
  ].join(' ');


  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="font-semibold text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="text-red-500 ltr:ml-1 rtl:mr-1">*</span>}
        </label>
        {children}
      </div>
      <select
        id={id}
        value={value} // Use the direct value from state to ensure it's always shown
        onChange={onChange}
        className={selectClasses}
      >
        <option value="" disabled={!!value}>{placeholder || 'Pilih...'}</option>
        {displayOptions.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default PromptSelect;