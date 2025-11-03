
export type KMapValue = '0' | '1' | 'X';

export interface Solution {
    expression: string;
    explanation: string;
}

export interface KMapConfig {
    rows: string[];
    cols: string[];
    rowVar: string;
    colVar: string;
    indices: number[][];
}
