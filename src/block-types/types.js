import nodeIdentifierRef from '../compilers/utils/nodeIdentifierRef';
import {MOTOKO_KEYWORDS} from '../config/configureMonaco';
import {formatParentheses} from '../editor/format/formatHelpers';
import isPrincipal from '../utils/isPrincipal';

class Type {
    constructor(name, parent, generics, data = {}, meta = {}) {
        this.name = name;
        this.parent = parent;
        this.generics = generics.map(type => getType(type));
        this.data = data;
        this.meta = meta;
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

    withMeta(meta) {
        let {name, info, ...otherMeta} = meta;
        let type = buildType(name || this.name, this, this.generics, {info});
        Object.assign(type.meta, otherMeta);
        return type;
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

    // TODO: rename to something like `isProperSubtype` or `isAssignableFrom`
    isSubtype(other) {
        if(!other) {
            return false;
        }
        if(this.data.alwaysSubtype === other) {
            return true;///
        }
        if(this.data.isSpecialSubtype?.call(this, other)) {
            return true;
        }
        if(this.data.arbitraryGenericType && other.parent && this.name === other.parent.name && other.generics.every(t => this.data.arbitraryGenericType.isSubtype(t))) {
            // e.g. `Tuple : Tuple<A, B, C>`
            return true;
        }
        if(this.name === other.name) {
            return this.generics.length === other.generics.length && this.generics.every((t, i) => t.isSubtype(other.generics[i]));
        }
        return !!other.parent && this.isSubtype(other.parent);
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
        return this.data.toTypeString?.call(this) ?? this.name + (this.generics.length ? '<' + this.generics.map(g => g.toTypeString()).join(', ') + '>' : '');
    }

    toString() {
        return `Type(${this.toTypeString()})`;
    }
}

export const TYPE_MAP = new Map();

window.TYPE_MAP = TYPE_MAP; // Browser debug

export const anyType = createType('Any', {
    abstract: true,
    category: 'default',
    reversed: false,
});
export const anyReversedType = createType('AnyReversed', {
    abstract: true,
    category: 'default',
    // parent: anyType,
    reversed: true,
});

export const typeType = createType('Type', {
    info: 'A specific category of possible values',
    parent: anyType,
    category: 'types',
    controlType: 'type',
    defaultValue: type => type.generics[0],
    generics: [anyType],
    fromJSON(value) {
        return getType(value);
    },
});
export const nodeType = createType('Node', {
    info: 'A specific node in the editor',
    parent: anyType,
    category: 'nodes',
    controlType: 'node',
    toTypeString() {
        return this.meta.block ? `Node{block=${JSON.stringify(this.meta.block)}}` : 'Node';
    },
});

// High-level type categories
export const valueType = createType('Value', {
    abstract: true,
    parent: anyType,
    category: 'values',
    toMotoko() {
        if(this === valueType) {
            return 'Any';
        }
    },
});
export const customType = createType('Custom', {
    info: 'A custom user-defined value',
    arbitraryGenericType: valueType,
    parent: valueType,
    hidden: true,
    // toMotoko() {
    //     console.log(this);///
    //     return this.meta.motoko || `$${this.toTypeString()}$`;
    // },
});
export const referenceType = createType('Reference', {
    info: 'A programmatic path to a value, type, function, actor, class, object, or module',
    parent: anyType,
    category: 'references',
    controlType: 'text',
    validation: {
        custom: value => !MOTOKO_KEYWORDS.includes(value),
    },
});
export const identifierType = createType('Identifier', {
    info: 'A name consisting of letters and underscores',
    parent: referenceType,
    controlType: 'text',
    // defaultValue: '',
    validation: {
        pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
        custom: value => !MOTOKO_KEYWORDS.includes(value),
    },
    defaultInput(prop, node) {
        // Create placeholder identifier
        return nodeIdentifierRef(node, prop.key);
    },
});
export const effectType = createType('Statement', {
    info: 'A statement which runs after calling a function',
    parent: anyReversedType,
    category: 'effects',
    generics: [valueType],
    toMotoko([value]) {
        return value;
    },
});
export const memberType = createType('Member', {
    info: 'Something defined within a container (actor, object, class, or module)',
    parent: anyReversedType,
    singleOutput: true,
    category: 'members',
});
export const containerType = createType('Container', {
    info: 'An actor, object, class, or module',
    parent: memberType,
    singleOutput: true,
    category: 'containers',
});
// export const moduleType = createType('Module', {
//     info: 'A group of related containers (actors, objects, classes, and/or modules)',
//     parent: memberType,
//     singleOutput: true,
//     category: 'modules',
// });
export const paramType = createType('Parameter', {
    info: 'An input to a function, class, or actor',
    parent: anyReversedType,
    category: 'parameters',
    generics: [valueType],
});

// Value types
export const boolType = createType('Bool', {
    info: 'A logical value representing "true" or "false"',
    parent: valueType,
    controlType: 'checkbox',
    defaultValue: false,
});
export const charType = createType('Char', {
    info: 'A single character of text',
    parent: valueType,
    controlType: 'text',
    validation: {
        minLength: 1,
        maxLength: 1,
    },
});
export const textType = createType('Text', {
    info: 'A sequence of letters, numbers, emojis, and/or other characters',
    parent: valueType,
    controlType: 'text',
    defaultValue: '',
});
export const floatType = createType('Float', {
    info: 'A decimal number (-0.1, 123, 1.0e5)',
    parent: valueType,
    controlType: 'text',
    validation: {
        custom: value => !isNaN(+value),
    },
    defaultValue: 0,
});
export const intType = createType('Int', {
    info: 'A numeric integer (..., -2, -1, 0, 1, 2, ...)',
    parent: floatType,
    category: 'integers',
    controlType: 'number',
    validation: {
        step: 1,
    },
});
export const natType = createType('Nat', {
    info: 'A natural number (0, 1, 2, ...)',
    parent: floatType,
    category: 'naturals',
    controlType: 'number',
    validation: {
        step: 1,
        min: 0,
    },
});
export const blobType = createType('Blob', {
    info: 'Immutable binary data (similar to an HTML5 blob)',
    parent: valueType,
});
export const principalType = createType('Principal', {
    info: 'A wallet or smart contract address',
    parent: valueType,
    category: 'principals',
    validation: {
        custom: value => isPrincipal(value),
    },
});
export const errorType = createType('Error', {
    info: 'An error value for custom exception handling',
    parent: valueType,
});
export const tupleType = createType('Tuple', {
    info: 'A combination of multiple values in a specific order',
    abstract: true,
    arbitraryGenericType: valueType,
    parent: valueType,
    category: 'tuples',
    // controlType: ,
    toTypeString() {
        return this === tupleType ? this.name : `(${this.generics.map(t => t.toTypeString()).join(', ')})`;
    },
    toMotoko(values) {
        return `(${values.join(', ')})`;
    },
});
// export const unitType = createType('Unit', {
//     parent: tupleType,
// });
export const unitType = createType('Unit', tupleType.withMeta({
    info: 'An empty tuple \'()\' is the only possible value for the "Unit" type',
}));
if(tupleType === unitType) throw new Error(); // TODO: move to tests
export const objectType = createType('Object', {
    info: 'An object which can include values, functions, types, or other members',
    abstract: true,
    arbitraryGenericType: valueType,
    parent: valueType,
    category: 'objects',
    // controlType: ,
    toTypeString() {
        return `{${this.generics.map((t, i) => `${this.genericNames[i]}: ${t.toTypeString()}`).join(', ')}}`;
    },
    toMotoko(values) {
        return `{${values.map((t, i) => `${this.genericNames[i]}: ${t}`).join(', ')}}`;
    },
});
export const functionType = createType('Function', {
    info: 'A callable sequence of events which optionally returns a value',
    parent: valueType,
    generics: [tupleType, valueType],
    genericNames: ['input', 'output'],
    category: 'functions',
    toTypeString() {
        return `(${this.generics[0].toTypeString()} -> ${this.generics[1].toTypeString()})`;
    },
    toMotoko([input, output]) {
        return formatParentheses(`${input} -> ${output}`);
    },
});
export const optionalType = createType('Optional', {
    info: 'A value which has the possibility of being null',
    parent: valueType,
    generics: [valueType],
    category: 'optionals',
    toMotoko([value]) {
        return `?${value}`;
    },
});
export const nullType = createType('Null', {
    info: 'An "Optional" value representing nothing',
    parent: valueType,
    alwaysSubtype: optionalType,
});
export const collectionType = createType('Collection', {
    info: 'A compound data structure such as an Array or Map',
    abstract: true,
    parent: valueType,
    category: 'collections',
});
export const arrayType = createType('Array', {
    info: 'An ordered sequence of values with a specific type',
    parent: collectionType,
    generics: [valueType],
    genericNames: ['item'],
    toMotoko([item]) {
        return `[${item}]`;
    },
});
export const mutableArrayType = createType('MutableArray', {
    parent: arrayType,
    generics: [valueType],
    genericNames: ['item'],
    toMotoko([item]) {
        return `[var ${item}]`;
    },
});
export const mapType = createType('Map', {
    info: 'A dictionary-style object for mapping keys to values',
    parent: collectionType,
    generics: [valueType, valueType],
    genericNames: ['key', 'value'],
    toMotoko([key, value]) {
        return `HashMap.HashMap<${key}, ${value}>`; // TODO: import reference
    },
});
export const asyncType = createType('Async', {
    info: 'An asynchronous value or process',
    parent: valueType,
    generics: [valueType],
    category: 'futures',
    toMotoko([value]) {
        return `async ${value}`;
    },
});
export const unionType = createType('Union', {
    info: 'Any of the specified types',
    abstract: true,
    parent: valueType,
    arbitraryGenericType: valueType,
    controlType: 'type',
    isSpecialSubtype(other) {
        return this.generics.some(t => t.isSubtype(other));
    },
    toMotoko(values) {
        return formatParentheses(values.join(' or '));
    },
});
export const intersectionType = createType('Intersection', {
    info: 'All of the specified types',
    abstract: true,
    parent: valueType,
    arbitraryGenericType: valueType,
    controlType: 'type',
    isSpecialSubtype(other) {
        return this.generics.every(t => t.isSubtype(other));
    },
    toMotoko(values) {
        return formatParentheses(values.join(' and '));
    },
});
export const noneType = createType('None', {
    info: 'A type with no possible value',
    parent: valueType,
});

// // Fixed-size int values
export const int8Type = createSizedType(intType, getIntValidation, 8, 'An 8-bit integer');
export const int16Type = createSizedType(intType, getIntValidation, 16, 'A 16-bit integer');
export const int32Type = createSizedType(intType, getIntValidation, 32, 'A 32-bit integer');
export const int64Type = createSizedType(intType, getIntValidation, 64, 'A 64-bit integer');

// Fixed-size nat values
export const nat8Type = createSizedType(natType, getNatValidation, 8, 'An 8-bit natural number');
export const nat16Type = createSizedType(natType, getNatValidation, 16, 'A 16-bit natural number');
export const nat32Type = createSizedType(natType, getNatValidation, 32, 'A 32-bit natural number');
export const nat64Type = createSizedType(natType, getNatValidation, 64, 'A 64-bit natural number');

function getNatValidation(n) {
    return {
        ...natType.data.validation,
        max: 2 ** n - 1,
    };
}

function getIntValidation(n) {
    let size = 2 ** (n - 1);
    return {
        ...intType.data.validation,
        min: -size,
        max: size - 1,
    };
}

function createSizedType(parent, validationFn, size, info) {
    return createType(`${parent.name}${size}`, {
        parent,
        validation: validationFn(size),
        info,
    });
}

// Create a global type
function createType(name, data) {
    let type;
    if(data instanceof Type) {
        type = data;
        type.name = name;
    }
    else {
        let {parent} = data;
        let {generics = [], meta = {}, ...other} = data;
        type = buildType(name, parent, generics, other, meta);
        type.data.baseType = type;
    }
    TYPE_MAP.set(name, type);
    return type;
}

// Instantiate a new type
function buildType(name, parent, generics, data = {}, meta = {}) {
    // Special cases for data inheritance
    let {
        abstract,
        arbitraryGenericType,
        ...parentData
    } = parent ? parent.data : {};
    let parentMeta = parent ? parent.meta : {};
    return new Type(
        name,
        parent || null,
        generics || (parent ? parent.generics : []),
        {...parentData, ...data},
        {...parentMeta, ...meta},
    );
}

// Get or create a generic version of the given type
function getGenericType(parent, generics) {
    if(typeof parent === 'string') {
        // parent = getType(parent);
        const parentName = parent;
        parent = TYPE_MAP.get(parentName);
        if(!parent) {
            throw new Error(`Unknown type with name: ${parentName}`);
        }
    }

    // TODO: refactor special cases
    if(parent.name === tupleType.name && parent !== tupleType && !generics.length) {
        return unitType;
    }
    // if(parent === tupleType && !generics.length) {
    //     return unitType;
    // }
    if(parent === asyncType && generics.length && asyncType.isSubtype(generics[0])) {
        return generics[0];
    }

    if((!generics || !generics.length || generics === parent.generics) && !parent.data.arbitraryGenericType) {
        return getType(parent);
    }
    let type = buildType(parent.name, parent, generics);
    if(!parent.isSubtype(type)) {
        throw new Error(`Generics not assignable to ${parent.toTypeString()} from ${type.toTypeString()}`);
    }
    return type;
}

// Get or create a type
export function getType(type, generics) {
    if(!type) {
        throw new Error(`Invalid type: ${type}`);
    }
    if(arguments.length > 1) {
        return getGenericType(type, generics);
    }
    if(type instanceof Type) {
        return type;
    }
    if(typeof type === 'object') {
        if(type.generics) {
            return getGenericType(type.name, type.generics.map(t => getType(t)));
        }
        else if(TYPE_MAP.has(type.name)) {
            return TYPE_MAP.get(type.name);
        }
        else {
            throw new Error(`Unknown type: ${type.name}`);
        }
    }
    console.warn('Creating type from value:', type);
    if(TYPE_MAP.has(type)) {
        return TYPE_MAP.get(type);
    }
    throw new Error(`Unknown type: ${type && typeof type === 'object' ? `object with keys: ${Object.keys(type)}` : type}`);
}

export function getSharedType(...types) {
    let a = types[0];
    for(let i = 1; i < types.length; i++) {
        let b = types[i];
        if(!a) {
            a = b;
        }
        else if(b) {
            a = a.getSharedType(b);
        }
    }
    return a;
}