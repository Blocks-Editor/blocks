import {
    FaCode,
    FaCubes,
    FaDatabase,
    FaEject,
    FaFilter,
    FaFont,
    FaLongArrowAltRight,
    FaNetworkWired,
    FaPlusCircle,
    FaStream,
    FaTextHeight,
    FaTh,
} from 'react-icons/fa';

class Category {
    constructor(name, parent, data = {}) {
        this.name = name;
        this.parent = parent;
        this.root = parent ? parent.root : this;
        this.data = data;
    }
}

const CATEGORY_MAP = new Map();

function createCategory(data) {
    let {name, parent, ...other} = data;
    let category = new Category(name, parent, parent ? {...parent.data, ...other} : other);
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
export const stateCategory = createCategory({
    name: 'State',
    color: '#3fd',
    icon: FaDatabase,
    priority: 10,
});
export const functionCategory = createCategory({
    name: 'Function',
    color: '#fd3',
    icon: FaCubes,
    priority: 20,
});
export const paramCategory = createCategory({
    name: 'Param',
    color: '#a8f',
    icon: FaLongArrowAltRight,
    priority: 3,
});
export const typeCategory = createCategory({
    name: 'Type',
    color: '#2af',
    icon: FaTextHeight,
});
export const collectionCategory = createCategory({
    name: 'Collection',
    color: '#1c8',
    icon: FaTh,
});
export const compilerCategory = createCategory({
    name: 'Compiler',
    color: '#f5a',
    icon: FaCode,
});
export const expressionCategory = createCategory({
    name: 'Expression',
    color: '#aaa',
    icon: FaEject,
});
export const operatorCategory = createCategory({
    name: 'Operator',
    // color: '#57f',
    icon: FaFilter,
});
export const actorCategory = createCategory({
    name: 'Actor',
    color: '#fa8',
    icon: FaFont,
});
export const effectCategory = createCategory({
    name: 'Effect',
    // color: '#57f',
    icon: FaStream,
    priority: 5,
});
export const literalCategory = createCategory({
    name: 'Literal',
    // color: '#8fa',
    icon: FaPlusCircle,
});
export const decompositionCategory = createCategory({
    name: 'Decomposition',
    // color: '#ccc',
    icon: FaNetworkWired,
});
