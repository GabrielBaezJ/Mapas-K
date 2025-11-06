import React from 'react';
import type { Solution, Group } from '../types';
import { GROUP_COLORS } from '../constants';

interface SolutionDisplayProps {
    solutions: Solution[];
    solutionIndex: number;
    setSolutionIndex: (index: number) => void;
}

// A simple markdown-to-html converter
const renderMarkdown = (text: string) => {
    // Replace **bold** with <strong>bold</strong>
    const bolded = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Replace newlines with <br> for display in HTML
    const withLineBreaks = bolded.replace(/\n/g, '<br />');
    return { __html: withLineBreaks };
};

const GroupInfo: React.FC<{ group: Group, index: number }> = ({ group, index }) => {
    const color = GROUP_COLORS[index % GROUP_COLORS.length];

    return (
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-700/50">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}></div>
            <div className="font-mono text-cyan-300 text-lg font-bold">{group.term}</div>
            <div className="text-slate-400 text-sm">
                (Cubre mintérminos: {group.minterms.join(', ')})
            </div>
        </div>
    );
};


const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ solutions, solutionIndex, setSolutionIndex }) => {
    const currentSolution = solutions[solutionIndex];

    if (!currentSolution) {
        return <div className="text-center text-slate-400">No hay solución para mostrar.</div>;
    }

    return (
        <div className="space-y-6">
            {solutions.length > 1 && (
                <div className="flex justify-center items-center gap-4 bg-slate-700/50 p-2 rounded-lg">
                    <p className="text-sm text-slate-300">
                        {`Se encontraron ${solutions.length} soluciones mínimas. Mostrando ${solutionIndex + 1} de ${solutions.length}.`}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSolutionIndex((i) => Math.max(0, i - 1))}
                            disabled={solutionIndex === 0}
                            className="px-3 py-1 bg-slate-600 rounded disabled:opacity-50"
                            aria-label="Solución anterior"
                        >
                            &larr;
                        </button>
                        <button
                            onClick={() => setSolutionIndex((i) => Math.min(solutions.length - 1, i + 1))}
                            disabled={solutionIndex === solutions.length - 1}
                            className="px-3 py-1 bg-slate-600 rounded disabled:opacity-50"
                            aria-label="Siguiente solución"
                        >
                            &rarr;
                        </button>
                    </div>
                </div>
            )}

            <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Expresión Simplificada (SOP)</h3>
                <div className="bg-slate-900/70 p-4 rounded-lg text-center">
                    <p className="font-mono text-2xl font-bold text-cyan-300 tracking-wider">
                        F = {currentSolution.expression}
                    </p>
                </div>
            </div>

            <div>
                 <h3 className="text-lg font-semibold text-slate-300 mb-2">Grupos Utilizados</h3>
                 <div className="space-y-2">
                     {currentSolution.groups.map((group, index) => (
                         <GroupInfo key={index} group={group} index={index} />
                     ))}
                 </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Explicación Paso a Paso</h3>
                <div
                    className="prose prose-invert prose-strong:text-cyan-400 bg-slate-900/70 p-4 rounded-lg text-slate-300 leading-relaxed"
                    dangerouslySetInnerHTML={renderMarkdown(currentSolution.explanation)}
                />
            </div>
        </div>
    );
};

export default SolutionDisplay;
