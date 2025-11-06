import React from 'react';

interface VariableEditorProps {
    variableNames: string[];
    onNameChange: (index: number, newName: string) => void;
}

const VariableEditor: React.FC<VariableEditorProps> = ({ variableNames, onNameChange }) => {
    return (
        <div className="mt-6">
            <label className="block text-center text-slate-400 mb-3 font-semibold">
                Nombres de las Variables
            </label>
            <div className="flex justify-center items-center gap-2 sm:gap-4 flex-wrap">
                {variableNames.map((name, index) => (
                    <div key={index} className="flex items-center gap-2">
                         <span className="font-bold text-slate-300">{`Var ${index + 1}:`}</span>
                         <input
                            type="text"
                            value={name}
                            onChange={(e) => onNameChange(index, e.target.value.toUpperCase())}
                            maxLength={5}
                            className="w-20 bg-slate-700/50 border border-slate-600 rounded-md p-2 text-center font-bold text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-colors"
                            aria-label={`Nombre para la variable ${index + 1}`}
                         />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VariableEditor;
