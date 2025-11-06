export type KMapValue = '0' | '1' | 'X';

export interface Group {
    term: string;
    minterms: number[];
}

export interface Solution {
    expression: string;
    explanation: string;
    groups: Group[];
}

export interface KMapConfig {
    rows: string[];
    cols: string[];
    rowVar: string;
    colVar: string;
    indices: number[][];
}