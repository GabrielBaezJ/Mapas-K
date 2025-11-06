import React from 'react';
import type { KMapValue, KMapConfig, Solution } from '../types';
import { GROUP_COLORS } from '../constants';

interface KMapGridProps {
    numVars: number;
    kmapData: KMapValue[];
    onMapChange: (newMapData: KMapValue[]) => void;
    config: KMapConfig;
    variableNames: string[];
    solution?: Solution;
}

const KMapGrid: React.FC<KMapGridProps> = ({ numVars, kmapData, onMapChange, config, variableNames, solution }) => {

    const handleCellClick = (index: number) => {
        const currentVal = kmapData[index];
        const nextVal: KMapValue = currentVal === '0' ? '1' : currentVal === '1' ? 'X' : '0';
        const newMapData = [...kmapData];
        newMapData[index] = nextVal;
        onMapChange(newMapData);
    };

    const getCellClass = (val: KMapValue) => {
        switch (val) {
            case '1': return 'bg-cyan-500/80 text-white';
            case 'X': return 'bg-violet-500/80 text-white';
            case '0': return 'bg-slate-700/60 text-slate-300';
            default: return 'bg-slate-700/60 text-slate-300';
        }
    };

    const getCellStyles = (dataIndex: number): React.CSSProperties => {
        if (!solution) return {};
        
        let groupIndex = -1;
        const group = solution.groups.find((g, index) => {
            if (g.minterms.includes(dataIndex)) {
                groupIndex = index;
                return true;
            }
            return false;
        });

        if (group && groupIndex !== -1) {
            const color = GROUP_COLORS[groupIndex % GROUP_COLORS.length];
            return {
                boxShadow: `inset 0 0 0 3px ${color}, 0 0 12px ${color}`,
                zIndex: 20
            };
        }
        return {};
    };

    const renderGrid = (gridIndex: 0 | 1 = 0) => {
        const isFiveVar = numVars === 5;
        const indexOffset = isFiveVar && gridIndex === 1 ? 16 : 0;
        const { rows, cols, indices } = config;
        
        let rowVar = config.rowVar;
        let colVar = config.colVar;
        
        if (variableNames.length === numVars) {
            if (numVars === 2) { rowVar = variableNames[0]; colVar = variableNames[1]; }
            if (numVars === 3) { rowVar = variableNames[0]; colVar = variableNames.slice(1).join(''); }
            if (numVars === 4) { rowVar = variableNames.slice(0, 2).join(''); colVar = variableNames.slice(2).join(''); }
            if (numVars === 5) { rowVar = variableNames.slice(1, 3).join(''); colVar = variableNames.slice(3).join(''); }
        }

        return (
            <div className="relative p-4 sm:p-6 select-none">
                 {isFiveVar && (
                    <h3 className="text-center font-bold text-lg mb-2 text-slate-300">{variableNames[0]} = {gridIndex}</h3>
                )}
                <div className="grid" style={{ gridTemplateColumns: `auto repeat(${cols.length}, minmax(0, 1fr))` }}>
                    <div className="relative text-sm sm:text-base font-semibold text-slate-400 flex items-end justify-end pr-2 pb-1">
                        <span className="absolute -translate-x-full bottom-1">{rowVar}</span>
                        <span className="absolute translate-y-full right-1">{colVar}</span>
                        <svg width="20" height="20" viewBox="0 0 100 100" className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 text-slate-600">
                            <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                    </div>
                    {cols.map((col) => (
                        <div key={col} className="flex items-center justify-center h-10 sm:h-12 text-sm sm:text-base font-bold text-slate-300">{col}</div>
                    ))}
                    {rows.map((row, rowIndex) => (
                        <React.Fragment key={row}>
                            <div className="flex items-center justify-center w-10 sm:w-12 text-sm sm:text-base font-bold text-slate-300">{row}</div>
                            {cols.map((_, colIndex) => {
                                const dataIndex = indices[rowIndex][colIndex] + indexOffset;
                                return (
                                    <button
                                        key={`${rowIndex}-${colIndex}`}
                                        type="button"
                                        onClick={() => handleCellClick(dataIndex)}
                                        aria-label={`Celda para el mintérmino ${dataIndex}. Valor actual: ${kmapData[dataIndex]}. Haz clic para cambiar.`}
                                        style={getCellStyles(dataIndex)}
                                        className={`relative flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 m-1 rounded-lg text-2xl sm:text-3xl font-mono font-bold transition-all duration-200 transform hover:scale-110 hover:z-10 shadow-md border border-slate-600/50 hover:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-fuchsia-500 ${getCellClass(kmapData[dataIndex])}`}
                                    >
                                        {kmapData[dataIndex]}
                                    </button>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    };

    if (numVars === 5) {
        return <div className="flex flex-col md:flex-row justify-center items-start">{renderGrid(0)}{renderGrid(1)}</div>;
    }

    return <div className="flex justify-center items-center">{renderGrid()}</div>;
};

export default KMapGrid;