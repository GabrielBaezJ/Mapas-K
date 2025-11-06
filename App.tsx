import React, { useState, useEffect, useMemo } from 'react';
import VariableSelector from './components/VariableSelector';
import KMapGrid from './components/KMapGrid';
import VariableEditor from './components/VariableEditor';
import SolutionDisplay from './components/SolutionDisplay';
import { solveKMap } from './services/geminiService';
import type { KMapValue, Solution } from './types';
import { KMAP_CONFIGS } from './constants';

const App: React.FC = () => {
    const [numVars, setNumVars] = useState<number>(4);
    const [variableNames, setVariableNames] = useState<string[]>(['A', 'B', 'C', 'D']);
    const [kmapData, setKmapData] = useState<KMapValue[]>(Array(16).fill('0'));
    const [solutions, setSolutions] = useState<Solution[] | null>(null);
    const [solutionIndex, setSolutionIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const newSize = Math.pow(2, numVars);
        setKmapData(Array(newSize).fill('0'));
        setVariableNames('ABCDE'.slice(0, numVars).split(''));
        setSolutions(null);
        setSolutionIndex(0);
        setError(null);
    }, [numVars]);

    const handleSolve = async () => {
        setIsLoading(true);
        setError(null);
        setSolutions(null);
        setSolutionIndex(0);
        try {
            const result = await solveKMap(numVars, kmapData, variableNames);
            if (result.solutions && result.solutions.length > 0) {
                setSolutions(result.solutions);
            } else {
                setError("La IA no encontró una solución o devolvió una respuesta inesperada.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocurrió un error desconocido.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleVarChange = (vars: number) => {
        setNumVars(vars);
    };

    const handleMapChange = (newMapData: KMapValue[]) => {
        setKmapData(newMapData);
        setSolutions(null); // Reset solution if map changes
    };
    
    const handleNameChange = (index: number, newName: string) => {
        const newNames = [...variableNames];
        newNames[index] = newName;
        setVariableNames(newNames);
    };
    
    const kmapConfig = useMemo(() => KMAP_CONFIGS[numVars], [numVars]);

    return (
        <div className="bg-slate-900 text-white min-h-screen font-sans">
            <header className="text-center p-6 bg-slate-800/50 border-b border-slate-700">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500">
                    Solucionador de Mapas de Karnaugh con IA
                </h1>
                <p className="text-slate-400 mt-2">
                    Selecciona el número de variables, llena el mapa K y obtén la solución simplificada con una explicación paso a paso.
                </p>
            </header>

            <main className="container mx-auto p-4 sm:p-6">
                <div className="max-w-md mx-auto mb-8">
                    <VariableSelector selectedVars={numVars} onVarChange={handleVarChange} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 shadow-lg">
                         <VariableEditor variableNames={variableNames} onNameChange={handleNameChange} />
                        <KMapGrid
                            numVars={numVars}
                            kmapData={kmapData}
                            onMapChange={handleMapChange}
                            config={kmapConfig}
                            variableNames={variableNames}
                            solution={solutions ? solutions[solutionIndex] : undefined}
                        />
                        <div className="mt-4 flex flex-col items-center gap-4">
                            <button
                                onClick={handleSolve}
                                disabled={isLoading}
                                className="w-full max-w-xs bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white font-bold py-3 px-6 rounded-full hover:from-fuchsia-700 hover:to-violet-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analizando...
                                    </>
                                ) : (
                                    '✨ Resolver con IA'
                                )}
                            </button>
                             <button
                                onClick={() => setKmapData(Array(Math.pow(2, numVars)).fill('0'))}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                Limpiar Mapa
                            </button>
                        </div>
                    </div>
                    
                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-lg min-h-[500px]">
                        <h2 className="text-2xl font-bold text-center mb-4 text-cyan-400">Solución y Explicación</h2>
                        {isLoading && <div className="text-center text-slate-400">La IA está trabajando... por favor espera.</div>}
                        {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">{error}</div>}
                        {!isLoading && !error && !solutions && (
                            <div className="text-center text-slate-500 p-8">
                                <p className="text-lg">La solución aparecerá aquí una vez que llenes el mapa y hagas clic en "Resolver con IA".</p>
                            </div>
                        )}
                        {solutions && (
                            <SolutionDisplay
                                solutions={solutions}
                                solutionIndex={solutionIndex}
                                setSolutionIndex={setSolutionIndex}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
