import Rete from 'rete';
import CheckboxControlHandle from '../components/rete/controls/CheckboxControlHandle';
import NumberControlHandle from '../components/rete/controls/NumberControlHandle';
import TextControlHandle from '../components/rete/controls/TextControlHandle';

const sockets = new Map();

class TypeSocket extends Rete.Socket {
    compatibleWith(socket) {
        let reversed = !!this.data.reversed;
        if(reversed === !socket.data.reversed) {
            return false;
        }
        let self = socket;
        // if(reversed) {
        //     [self, socket] = [socket, self];
        // }
        return (self.name === socket.name) /*super.compatibleWith(socket)*/ || (!!self.data.parent && self.data.parent.compatibleWith(socket));
    }
}

// TODO: refactor to our own type system

// https://github.com/dfinity/motoko/blob/master/doc/modules/language-guide/pages/language-manual.adoc#primitive-types

// Anything passable through a socket
export const anySocket = createSocket('Any', {
    category: 'default',
});
export const anyReversedSocket = createSocket('AnyReversed', {
    parent: anySocket,
    reversed: true,
});

// Void socket
export const voidSocket = createSocket('Void', {
    category: 'void',
});

// High-level socket categories
export const valueSocket = createSocket('Value', {
    parent: anySocket,
    category: 'values',
});
export const typeSocket = createSocket('Type', {
    parent: anySocket,
    category: 'types',
    controlType: TextControlHandle,
    defaultValue: 'Void',
});
export const identifierSocket = createSocket('Identifier', {
    parent: anySocket,
    controlType: TextControlHandle, // TODO: constrain to valid identifiers
    defaultValue: '',
});
export const effectSocket = createSocket('Effect', {
    parent: anyReversedSocket,
    category: 'effects',
});
export const memberSocket = createSocket('Member', {
    parent: anyReversedSocket,
    category: 'members',
});
export const actorSocket = createSocket('Actor', {
    parent: anyReversedSocket,
    category: 'actors',
});
export const moduleSocket = createSocket('Module', {
    parent: anyReversedSocket,
    category: 'modules',
});
export const paramSocket = createSocket('Param', {
    parent: anyReversedSocket,
    category: 'parameters',
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
    defaultValue: '',
});
export const floatSocket = createSocket('Float', {
    parent: valueSocket,
    controlType: NumberControlHandle,
    defaultValue: 0,
});
export const intSocket = createSocket('Int', {
    parent: floatSocket,
    category: 'integers',
    controlType: NumberControlHandle,
    controlProps: {
        step: 1,
    },
});
export const natSocket = createSocket('Nat', {
    parent: floatSocket,
    category: 'naturals',
    controlProps: {
        step: 1,
        min: 0,
    },
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

// Fixed-size int values
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

// Fixed-size nat values
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
