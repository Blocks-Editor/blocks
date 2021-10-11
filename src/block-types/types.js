import TextControlHandle from '../components/rete/controls/TextControlHandle';
import CheckboxControlHandle from '../components/rete/controls/CheckboxControlHandle';
import NumberControlHandle from '../components/rete/controls/NumberControlHandle';

class Type {
    constructor(name, parent, generics, data = {}) {
        this.name = name;
        this.parent = parent;
        this.generics = generics;
        this.data = data;
    }

    equals(other) {
        return this.name === other.name && this.generics.length === other.generics.length && this.generics.every((t, i) => t.equals(other.generics[i]));
    }

    isAssignableFrom(other) {
        if(this.name === other.name) {
            return this.generics.length === other.generics.length && this.generics.every((t, i) => t.isAssignableFrom(other.generics[i]));
        }
        return !!this.data.parent && this.data.parent.isAssignableFrom(other);
    }

    toTypeString() {
        return this.name + (this.generics.length ? '<' + this.generics.map(g => g.toTypeString()).join(', ') + '>' : '');
    }

    toString() {
        return `Type(${this.toTypeString()})`;
    }
}

export const TYPE_MAP = new Map();

export const anyType = createType('Any', {
    category: 'default',
});
export const anyReversedType = createType('AnyReversed', {
    parent: anyType,
    reversed: true,
});

// Void type
export const voidType = createType('Void', {
    category: 'void',
});

// High-level type categories
export const valueType = createType('Value', {
    parent: anyType,
    category: 'values',
});
export const typeType = createType('Type', {
    parent: anyType,
    category: 'types',
    controlType: TextControlHandle,
    defaultValue: 'Void',
});
export const identifierType = createType('Identifier', {
    parent: anyType,
    controlType: TextControlHandle, // TODO: constrain to valid identifiers
    defaultValue: '',
});
export const effectType = createType('Effect', {
    parent: anyReversedType,
    category: 'effects',
});
export const memberType = createType('Member', {
    parent: anyReversedType,
    category: 'members',
});
export const actorType = createType('Actor', {
    parent: anyReversedType,
    category: 'actors',
});
export const moduleType = createType('Module', {
    parent: anyReversedType,
    category: 'modules',
});
export const paramType = createType('Param', {
    parent: anyReversedType,
    category: 'parameters',
});

// Value types
export const boolType = createType('Bool', {
    parent: valueType,
    controlType: CheckboxControlHandle,
});
export const charType = createType('Char', {
    parent: valueType,
    controlType: TextControlHandle,
    controlProps: {
        maxLength: 1,
    },
});
export const textType = createType('Text', {
    parent: valueType,
    controlType: TextControlHandle,
    defaultValue: '',
});
export const floatType = createType('Float', {
    parent: valueType,
    controlType: NumberControlHandle,
    defaultValue: 0,
});
export const intType = createType('Int', {
    parent: floatType,
    category: 'integers',
    controlType: NumberControlHandle,
    controlProps: {
        step: 1,
    },
});
export const natType = createType('Nat', {
    parent: floatType,
    category: 'naturals',
    controlProps: {
        step: 1,
        min: 0,
    },
});
export const blobType = createType('Blob', {
    parent: valueType,
});
export const principalType = createType('Principal', {
    parent: valueType,
});
export const errorType = createType('Error', {
    parent: valueType,
});

// Fixed-size int values
export const int8Type = createType('Int8', {
    parent: intType,
    controlProps: getIntProps(8),
});
export const int16Type = createType('Int16', {
    parent: intType,
    controlProps: getIntProps(16),
});
export const int32Type = createType('Int32', {
    parent: intType,
    controlProps: getIntProps(32),
});
export const int64Type = createType('Int64', {
    parent: intType,
    controlProps: getIntProps(64),
});

// Fixed-size nat values
export const nat8Type = createType('Nat8', {
    parent: natType,
    controlProps: getNatProps(8),
});
export const nat16Type = createType('Nat16', {
    parent: natType,
    controlProps: getNatProps(16),
});
export const nat32Type = createType('Nat32', {
    parent: natType,
    controlProps: getNatProps(32),
});
export const nat64Type = createType('Nat64', {
    parent: natType,
    controlProps: getNatProps(64),
});

function getNatProps(n) {
    return {
        ...intType.data.controlProps,
        max: 2 ** n - 1,
    };
}

function getIntProps(n) {
    let x = 2 ** (n - 1);
    return {
        ...intType.data.controlProps,
        min: -x,
        max: x - 1,
    };
}

function createType(name, data) {
    let parent = data.parent;
    if(parent) {
        data = {...parent.data, ...data};
    }
    let {generics = [], ...other} = data;
    let type = new Type(name, parent, generics, other);
    TYPE_MAP.set(name, type);
    return type;
}

function getGenericType(name, generics) {
    if(name instanceof Type) {
        return name;
    }
    if(!generics) {
        return getType(name);
    }
    let parent = getType(name);
    let type = new Type(name, parent, generics, parent.data);
    if(!parent.isAssignableFrom(type)) {
        throw new Error(`Generics not assignable to type: ${type}`);
    }
    return type;
}

export function getType(name) {
    if(name instanceof Type) {
        return name;
    }
    if(typeof name === 'object') {
        return getGenericType(name.name, (name.generics || []).map(t => getType(t)));
    }
    if(!name) {
        throw new Error(`Invalid type: ${name}`);
    }
    if(!TYPE_MAP.has(name)) {
        throw new Error(`Unknown type: ${name}`);
    }
    return TYPE_MAP.get(name);
}
