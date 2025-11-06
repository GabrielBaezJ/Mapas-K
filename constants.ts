import type { KMapConfig } from './types';

export const GROUP_COLORS = ['cyan', 'fuchsia', 'lime', 'yellow', 'tomato', 'red', 'blue', 'green'];

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
    },
    5: {
        rows: ['00', '01', '11', '10'],
        // FIX: Added missing 'cols' property to satisfy the KMapConfig type.
        cols: ['00', '01', '11', '10'],
        rowVar: 'BC', // Top variable A is handled separately
        colVar: 'DE',
        indices: [ // Base indices, will be offset for the second grid
            [0, 1, 3, 2],
            [4, 5, 7, 6],
            [12, 13, 15, 14],
            [8, 9, 11, 10]
        ]
    }
};
