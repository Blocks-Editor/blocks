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
    color: '#3FD',
});
export const functionCategory = createCategory('Function', {
    color: '#FD3',
});