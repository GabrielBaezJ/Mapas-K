
import type { KMapConfig } from './types';

export const KMAP_CONFIGS: { [key: number]: KMapConfig } = {
    2: {
        rows: ['0', '1'],
        cols: ['0', '1'],
        rowVar: 'A',
        colVar: 'B',
        indices: [
            [0, 1],
            [2, 3]
        ]
    },
    3: {
        rows: ['0', '1'],
        cols: ['00', '01', '11', '10'],
        rowVar: 'A',
        colVar: 'BC',
        indices: [
            [0, 1, 3, 2],
            [4, 5, 7, 6]
        ]
    },
    4: {
        rows: ['00', '01', '11', '10'],
        cols: ['00', '01', '11', '10'],
        rowVar: 'AB',
        colVar: 'CD',
        indices: [
            [0, 1, 3, 2],
            [4, 5, 7, 6],
            [12, 13, 15, 14],
            [8, 9, 11, 10]
        ]
    }
};
