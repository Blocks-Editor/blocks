import TextControlHandle from '../components/rete/controls/TextControlHandle';
import CheckboxControlHandle from '../components/rete/controls/CheckboxControlHandle';
import NumberControlHandle from '../components/rete/controls/NumberControlHandle';
import TypeControlHandle from '../components/rete/controls/TypeControlHandle';

class Type {
    // static fromJSON(json) {
    //     return getType(json);
    // }

    constructor(name, parent, generics, data = {}) {
        if(name instanceof Type) {
            throw new Error(`Type cannot be named ${name}`);
        }
        this.name = name;
        this.parent = parent;
        this.generics = generics.map(type => getType(type));
        this.data = data;
    }

    toJSON() {
        return {
            name: this.name,
            generics: this.generics.map(t => t.toJSON()),
        };
    }

    of(...generics) {
        return getType(this, generics);
    }

    isAbstract() {
        return this.data.abstract || this.generics.some(type => type.isAbstract());
    }

    getDefaultValue() {
        let value = this.data.defaultValue;
        return typeof value === 'function' ? value(this) : value;
    }

    equals(other) {
        return this.name === other.name && this.generics.length === other.generics.length && this.generics.every((t, i) => t.equals(other.generics[i]));
    }

    isSubtype(other) {
        if(!other) {
            return false;
        }
        if(this.name === other.name) {
            return this.generics.length === other.generics.length && this.generics.every((t, i) => t.isSubtype(other.generics[i]));
        }
        return !!other.data.parent && this.isSubtype(other.data.parent);
    }

    getSharedType(other) {
        if(!other) {
            return;
        }
        if(this === other) {
            return this;
        }
        if(this.isSubtype(other)) {
            return this;
        }
        if(other.isSubtype(this)) {
            return other;
        }
        if(this.parent) {
            return this.parent.getSharedType(other);
        }
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
    reversed: false,
});
export const anyReversedType = createType('AnyReversed', {
    category: 'default',
    // parent: anyType,
    reversed: true,
});

export const typeType = createType('Type', {
    parent: anyType,
    category: 'types',
    controlType: TypeControlHandle,
    defaultValue: type => type.generics[0],
    generics: [anyType],
});

// High-level type categories
export const valueType = createType('Value', {
    parent: anyType,
    category: 'values',
    abstract: true,
});
export const unitType = createType('Unit', {
    parent: valueType,
    toMotoko() {
        return `()`;
    },
});
export const identifierType = createType('Identifier', {
    parent: anyType,
    controlType: TextControlHandle,
    defaultValue: '',
    controlProps: {
        minLength: 1,
        // TODO: constrain to valid identifiers
    },
});
export const effectType = createType('Effect', {
    parent: anyReversedType,
    category: 'effects',
    generics: [valueType],
    toMotoko([value]) {
        return value;
    },
});
export const memberType = createType('Member', {
    parent: anyReversedType,
    singleOutput: true,
    category: 'members',
});
export const actorType = createType('Actor', {
    parent: anyReversedType,
    singleOutput: true,
    category: 'actors',
});
export const moduleType = createType('Module', {
    parent: anyReversedType,
    singleOutput: true,
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
    defaultValue: false,
});
export const charType = createType('Char', {
    parent: valueType,
    controlType: TextControlHandle,
    controlProps: {
        minLength: 1,
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
export const optionalType = createType('Optional', {
    parent: valueType,
    generics: [valueType],
    toMotoko([value]) {
        return `?${value}`;
    },
});

// Fixed-size int values
export const int64Type = createType('Int64', {
    parent: intType,
    controlProps: getIntProps(64),
});
export const int32Type = createType('Int32', {
    parent: int64Type,
    controlProps: getIntProps(32),
});
export const int16Type = createType('Int16', {
    parent: int32Type,
    controlProps: getIntProps(16),
});
export const int8Type = createType('Int8', {
    parent: int16Type,
    controlProps: getIntProps(8),
});

// Fixed-size nat values
export const nat64Type = createType('Nat64', {
    parent: natType,
    controlProps: getNatProps(64),
});
export const nat32Type = createType('Nat32', {
    parent: nat64Type,
    controlProps: getNatProps(32),
});
export const nat16Type = createType('Nat16', {
    parent: nat32Type,
    controlProps: getNatProps(16),
});
export const nat8Type = createType('Nat8', {
    parent: nat16Type,
    controlProps: getNatProps(8),
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
        // `abstract` is special case for data inheritance
        let {abstract, ...parentData} = parent.data;
        data = {...parentData, ...data};
    }
    let {generics = [], ...other} = data;
    let type = new Type(name, parent, generics, other);
    TYPE_MAP.set(name, type);
    return type;
}

function getGenericType(parent, generics) {
    if(!generics || !generics.length) {
        return getType(parent);
    }
    if(typeof parent === 'string') {
        parent = getType(parent);
    }
    let type = new Type(parent.name, parent, generics, parent.data);
    if(!parent.isSubtype(type)) {
        throw new Error(`Generics not assignable to ${parent} from ${type}`);
    }
    return type;
}

export function getType(name, generics) {
    if(arguments.length > 1) {
        return getGenericType(name, generics);
    }
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
