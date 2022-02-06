import {
    FaArrowRight,
    FaCode,
    FaCommentAlt,
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

export const CATEGORY_MAP = new Map();

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


export const defaultCategory = createCategory({
    name: 'Misc.',
});
export const stateCategory = createCategory({
    name: 'States',
    color: '#3fd',
    icon: FaDatabase,
    priority: 10,
});
export const functionCategory = createCategory({
    name: 'Functions',
    color: '#fd3',
    icon: FaCubes,
    priority: 20,
});
export const paramCategory = createCategory({
    name: 'Parameters',
    color: '#a8f',
    icon: FaLongArrowAltRight,
    priority: 3,
});
export const typeCategory = createCategory({
    name: 'Types',
    color: '#2af',
    icon: FaTextHeight,
});
export const collectionCategory = createCategory({
    name: 'Collections',
    color: '#1c5',
    icon: FaTh,
});
export const compilerCategory = createCategory({
    name: 'Compilers',
    color: '#f5a',
    icon: FaCode,
});
export const expressionCategory = createCategory({
    name: 'Expressions',
    color: '#aaa',
    icon: FaEject,
});
export const referenceCategory = createCategory({
    name: 'References',
    color: '#aaa',
    icon: FaArrowRight,
});
export const operatorCategory = createCategory({
    name: 'Operators',
    // color: '#57f',
    icon: FaFilter,
});
export const actorCategory = createCategory({
    name: 'Actors',
    color: '#fa8',
    icon: FaFont,
});
export const effectCategory = createCategory({
    name: 'Effects',
    // color: '#57f',
    icon: FaStream,
    priority: 5,
});
export const literalCategory = createCategory({
    name: 'Literals',
    // color: '#8fa',
    icon: FaPlusCircle,
    priority: 6,
});
export const decompositionCategory = createCategory({
    name: 'Decompositions',
    // color: '#ccc',
    icon: FaNetworkWired,
});
export const commentCategory = createCategory({
    name: 'Comments',
    // color: '#ccc',
    icon: FaCommentAlt,
    priority: -1,
});
