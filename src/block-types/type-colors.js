// TODO: combine into `src/block-categories/categories.js`

import {getType} from './types';

const categoryColors = {
    default: '#f5a',
    values: '#8fa',
    tuples: '#2aa',
    functions: '#fd3',
    objects: '#af8',
    optionals: '#384',
    collections: '#1c5',
    futures: '#aa6',
    types: '#2af',
    principals: '#888',
    references: '#eee',
    effects: '#ccc',
    members: '#8af',
    parameters: '#a8f',
    containers: '#fa8',
    integers: '#6fd',
    naturals: '#58f',
};

const typeColors = {
    Bool: '#d8f',
    Float: '#5df',
    Unit: '#333',
};

export function getTypeColor(type) {
    type = getType(type);
    return typeColors[type.name] || categoryColors[type.data.category];
}