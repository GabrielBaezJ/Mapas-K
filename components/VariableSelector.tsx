
import React from 'react';

interface VariableSelectorProps {
    selectedVars: number;
    onVarChange: (vars: number) => void;
}

const VAR_OPTIONS = [2, 3, 4];

const VariableSelector: React.FC<VariableSelectorProps> = ({ selectedVars, onVarChange }) => {
    return (
        <div className="flex justify-center items-center bg-slate-700/50 p-2 rounded-full">
            {VAR_OPTIONS.map((vars) => (
                <button
                    key={vars}
                    onClick={() => onVarChange(vars)}
                    className={`px-6 py-2 text-md font-semibold rounded-full transition-all duration-300 w-full
                        ${selectedVars === vars
                            ? 'bg-fuchsia-500 text-white shadow-md'
                            : 'text-slate-300 hover:bg-slate-600/50'
                        }`}
                >
                    {vars} Variables
                </button>
            ))}
        </div>
    );
};

export default VariableSelector;
