import {
    FaAngleDoubleRight,
    FaAngleRight,
    FaCircle,
    FaCode,
    FaCubes,
    FaDatabase,
    FaFilter,
    FaFont,
    FaLongArrowAltRight,
    FaNetworkWired, FaPlayCircle,
    FaPlusCircle,
    FaStream,
    FaTextHeight,
} from 'react-icons/all';

class Category {
    constructor(name, parent, data = {}) {
        this.name = name;
        this.parent = parent;
        this.root = parent ? parent.root : this;
        this.data = data;
    }
}

const CATEGORY_MAP = new Map();

function createCategory(name, data) {
    let {parent, ...other} = data;
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
export const stateCategory = createCategory('State', {
    color: '#3fd',
    icon: FaDatabase,
});
export const functionCategory = createCategory('Function', {
    color: '#fd3',
    icon: FaCubes,
});
export const callFunctionCategory = createCategory('FunctionCall', {
    parent: functionCategory,
    color: '#fd3',
    icon: FaPlayCircle,
});
export const paramCategory = createCategory('Param', {
    color: '#a8f',
    icon: FaLongArrowAltRight,
});
export const typeCategory = createCategory('Type', {
    color: '#2af',
    icon: FaTextHeight,
});
export const compilerCategory = createCategory('Compiler', {
    color: '#f5a',
    icon: FaCode,
});
export const operatorCategory = createCategory('Operator', {
    // color: '#57f',
    icon: FaFilter,
});
export const readStateCategory = createCategory('Read', {
    parent: stateCategory,
    icon: FaAngleRight,
});
export const writeStateCategory = createCategory('Write', {
    parent: stateCategory,
    icon: FaAngleDoubleRight,
});
export const actorCategory = createCategory('Actor', {
    color: '#fa8',
    icon: FaFont,
});
export const effectCategory = createCategory('Effect', {
    // color: '#57f',
    icon: FaStream,
});
export const literalCategory = createCategory('Literal', {
    // color: '#8fa',
    icon: FaPlusCircle,
});
export const decompositionCategory = createCategory('Decomposition', {
    // color: '#8fa',
    icon: FaNetworkWired,
});