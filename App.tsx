
import React, { useState, useCallback, useMemo } from 'react';
import type { KMapValue, Solution } from './types';
import { solveKMap } from './services/geminiService';
import VariableSelector from './components/VariableSelector';
import KMapGrid from './components/KMapGrid';
import SolutionDisplay from './components/SolutionDisplay';
import { KMAP_CONFIGS } from './constants';

const App: React.FC = () => {
    const [numVars, setNumVars] = useState<number>(3);
    const [kmapData, setKmapData] = useState<KMapValue[]>(Array(8).fill('0'));
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [selectedSolutionIndex, setSelectedSolutionIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleVarChange = useCallback((vars: number) => {
        setNumVars(vars);
        setKmapData(Array(Math.pow(2, vars)).fill('0'));
        setSolutions([]);
        setError(null);
        setSelectedSolutionIndex(0);
    }, []);

    const handleMapChange = useCallback((newMapData: KMapValue[]) => {
        setKmapData(newMapData);
    }, []);

    const handleSolve = async () => {
        setIsLoading(true);
        setError(null);
        setSolutions([]);
        try {
            const result = await solveKMap(numVars, kmapData);
            if (result.solutions && result.solutions.length > 0) {
                setSolutions(result.solutions);
                setSelectedSolutionIndex(0);
            } else {
                setError("No se encontraron soluciones o la respuesta no fue válida.");
            }
        } catch (err) {
            console.error(err);
            setError("No se pudo obtener una solución de la IA. Por favor, revisa la consola para más detalles.");
        } finally {
            setIsLoading(false);
        }
    };

    const kmapConfig = useMemo(() => KMAP_CONFIGS[numVars], [numVars]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a011a] via-slate-900 to-[#0f172a] text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 pb-2">
                        Solucionador de Mapas de Karnaugh Pro
                    </h1>
                    <p className="text-slate-400 mt-2 text-lg">
                        Simplifica expresiones booleanas con facilidad, con la tecnología de Gemini.
                    </p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-slate-800/50 p-6 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-sm">
                        <h2 className="text-2xl font-semibold mb-4 text-fuchsia-400">1. Configuración</h2>
                        <VariableSelector selectedVars={numVars} onVarChange={handleVarChange} />
                        
                        <h2 className="text-2xl font-semibold mt-8 mb-4 text-fuchsia-400">2. Editar Mapa</h2>
                        <div className="flex justify-center items-center">
                            <KMapGrid
                                numVars={numVars}
                                kmapData={kmapData}
                                onMapChange={handleMapChange}
                                config={kmapConfig}
                            />
                        </div>
                         <div className="mt-8 flex justify-center">
                            <button
                                onClick={handleSolve}
                                disabled={isLoading}
                                className="w-full sm:w-auto text-lg font-bold py-3 px-10 rounded-full text-white bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                {isLoading ? 'Resolviendo...' : 'Simplificar Expresión'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 p-6 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-sm min-h-[300px]">
                        <h2 className="text-2xl font-semibold mb-4 text-cyan-400">3. Solución</h2>
                         <SolutionDisplay
                            isLoading={isLoading}
                            error={error}
                            solutions={solutions}
                            selectedSolutionIndex={selectedSolutionIndex}
                            onSelectSolution={setSelectedSolutionIndex}
                        />
                    </div>
                </main>
                 <footer className="text-center mt-12 text-slate-500">
                    <p>Desarrollado por un ingeniero frontend React senior de clase mundial.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;