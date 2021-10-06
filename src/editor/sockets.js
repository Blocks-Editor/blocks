import Rete from 'rete';
import CheckboxControlHandle from '../components/rete/controls/CheckboxControlHandle';
import NumberControlHandle from '../components/rete/controls/NumberControlHandle';
import TextControlHandle from '../components/rete/controls/TextControlHandle';

const sockets = new Map();

class TypeSocket extends Rete.Socket {
    compatibleWith(socket) {
        return super.compatibleWith(socket) || (!!this.data.parent && this.data.parent.compatibleWith(socket));
    }
}

// TODO: refactor to our own type system

// https://github.com/dfinity/motoko/blob/master/doc/modules/language-guide/pages/language-manual.adoc#primitive-types

// Anything passable through a socket
export const anySocket = createSocket('Any', {});

// High-level socket categories
export const valueSocket = createSocket('Value', {
    parent: anySocket,
    category: 'values',
});
export const typeSocket = createSocket('Type', {
    parent: anySocket,
    category: 'types',
});
export const effectSocket = createSocket('Effect', {
    parent: anySocket,
    category: 'effects',
});
export const memberSocket = createSocket('Member', {
    parent: anySocket,
    category: 'members',
});
export const actorSocket = createSocket('Actor', {
    parent: anySocket,
    category: 'actors',
});
export const moduleSocket = createSocket('Module', {
    parent: anySocket,
    category: 'modules',
});

// Value sockets
export const boolSocket = createSocket('Bool', {
    parent: valueSocket,
    controlType: CheckboxControlHandle,
});
export const charSocket = createSocket('Char', {
    parent: valueSocket,
    controlType: TextControlHandle,
    controlProps: {
        maxLength: 1,
    },
});
export const textSocket = createSocket('Text', {
    parent: valueSocket,
    controlType: TextControlHandle,
});
export const floatSocket = createSocket('Float', {
    parent: valueSocket,
    controlType: NumberControlHandle,
});
export const intSocket = createSocket('Int', {
    parent: valueSocket,
    controlType: NumberControlHandle,
    controlProps: {
        step: 1,
    },
});
export const int8Socket = createSocket('Int8', {
    parent: intSocket,
    controlProps: getIntProps(8),
});
export const int16Socket = createSocket('Int16', {
    parent: intSocket,
    controlProps: getIntProps(16),
});
export const int32Socket = createSocket('Int32', {
    parent: intSocket,
    controlProps: getIntProps(32),
});
export const int64Socket = createSocket('Int64', {
    parent: intSocket,
    controlProps: getIntProps(64),
});
export const natSocket = createSocket('Nat', {
    parent: intSocket,
    controlProps: {
        step: 1,
        min: 0,
    },
});
export const nat8Socket = createSocket('Nat8', {
    parent: natSocket,
    controlProps: getNatProps(8),
});
export const nat16Socket = createSocket('Nat16', {
    parent: natSocket,
    controlProps: getNatProps(16),
});
export const nat32Socket = createSocket('Nat32', {
    parent: natSocket,
    controlProps: getNatProps(32),
});
export const nat64Socket = createSocket('Nat64', {
    parent: natSocket,
    controlProps: getNatProps(64),
});
export const blobSocket = createSocket('Blob', {
    parent: valueSocket,
});
export const principalSocket = createSocket('Principal', {
    parent: valueSocket,
});
export const errorSocket = createSocket('Error', {
    parent: valueSocket,
});

function getNatProps(n) {
    return {
        ...intSocket.data.controlProps,
        max: 2 ** n - 1,
    };
}

function getIntProps(n) {
    let x = 2 ** (n - 1);
    return {
        ...intSocket.data.controlProps,
        min: -x,
        max: x - 1,
    };
}

export function getSocket(name) {
    if(!name) {
        throw new Error(`Invalid socket type: ${name}`);
    }
    if(!sockets.has(name)) {
        throw new Error(`Unknown socket type: ${name}`);
    }
    return sockets.get(name);
}

function createSocket(name, data) {
    if(data.parent) {
        data = {...data.parent.data, ...data};
    }
    let socket = new TypeSocket(name, data);
    sockets.set(name, socket);
    return socket;
}
