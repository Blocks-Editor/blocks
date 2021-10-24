import {FaCode, FaDatabase} from 'react-icons/all';

class Category {
    constructor(name, data = {}) {
        this.name = name;
        this.data = data;
    }
}

const CATEGORY_MAP = new Map();

function createCategory(name, data) {
    let category = new Category(name, data);
    CATEGORY_MAP.set(category.name, category);
    return category;
}

export function getCategory(name) {
    if(name instanceof Category) {
        return name;
    }
    if(!CATEGORY_MAP.has(name)) {
        throw new Error(`Could not find category with name: ${name}`);
    }
    return CATEGORY_MAP.get(name);
}


export const defaultCategory = createCategory('Default', {});
export const stateCategory = createCategory('State', {
    color: '#3fd',
    icon: FaDatabase,
});
export const functionCategory = createCategory('Function', {
    color: '#fd3',
    // icon: FaLambda,
});
export const typeCategory = createCategory('Type', {
    color: '#2af',
    // icon: ,
});
export const compilerCategory = createCategory('Compiler', {
    color: '#f5a',
    icon: FaCode,
});
export const operatorCategory = createCategory('Operator', {
    // color: '#57f',
});