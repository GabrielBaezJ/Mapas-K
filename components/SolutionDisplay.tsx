
import React from 'react';
import type { Solution } from '../types';

interface SolutionDisplayProps {
    isLoading: boolean;
    error: string | null;
    solutions: Solution[];
    selectedSolutionIndex: number;
    onSelectSolution: (index: number) => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
        <p className="text-slate-400 text-lg">Gemini está pensando...</p>
    </div>
);

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ isLoading, error, solutions, selectedSolutionIndex, onSelectSolution }) => {
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center bg-red-900/20 border border-red-500/50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-red-400">Ocurrió un Error</h3>
                <p className="mt-2 text-red-300">{error}</p>
            </div>
        );
    }
    
    if (solutions.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-center">
                <p className="text-slate-400 text-lg">Tu expresión simplificada aparecerá aquí.</p>
            </div>
        );
    }

    const selectedSolution = solutions[selectedSolutionIndex];
    
    return (
        <div className="flex flex-col h-full">
            {solutions.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-4 border-b border-slate-700 pb-4">
                    {solutions.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => onSelectSolution(index)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
                                selectedSolutionIndex === index
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                        >
                            Solución {index + 1}
                        </button>
                    ))}
                </div>
            )}
            <div className="flex-grow overflow-y-auto">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-400 mb-2">Expresión Simplificada:</h3>
                    <p className="text-2xl font-bold bg-slate-900/50 p-4 rounded-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                       F = {selectedSolution.expression}
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-400 mb-2">Explicación:</h3>
                    <div className="prose prose-invert prose-p:my-1 text-slate-300 space-y-3 bg-slate-900/50 p-4 rounded-lg">
                        {selectedSolution.explanation.split('\n').map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SolutionDisplay;