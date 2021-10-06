import Rete from 'rete';
import CheckboxControlHandle from '../components/rete/controls/CheckboxControlHandle';

const sockets = new Map();

class TypeSocket extends Rete.Socket {
    compatibleWith(socket) {
        return super.compatibleWith(socket) || (this.data.parent && this.data.parent.compatibleWith(socket));
    }
}

// TODO: refactor to our own type system

// https://github.com/dfinity/motoko/blob/master/doc/modules/language-guide/pages/language-manual.adoc#primitive-types

// Anything passable through a socket
export const anySocket = createSocket('Any', {});

// High-level socket categories
export const valueSocket = createSocket('Value', {
    parent: anySocket,
});
export const typeSocket = createSocket('Type', {
    parent: anySocket,
});
export const effectSocket = createSocket('Effect', {
    parent: anySocket,
});
export const memberSocket = createSocket('Member', {
    parent: anySocket,
});
export const actorSocket = createSocket('Actor', {
    parent: anySocket,
});

// Value sockets
export const boolSocket = createSocket('Bool', {parent: valueSocket, control: CheckboxControlHandle});
export const charSocket = createSocket('Char', {parent: valueSocket});
export const textSocket = createSocket('Text', {parent: valueSocket});
export const floatSocket = createSocket('Float', {parent: valueSocket});
export const intSocket = createSocket('Int', {parent: valueSocket});
export const int8Socket = createSocket('Int8', {parent: intSocket});
export const int16Socket = createSocket('Int16', {parent: intSocket});
export const int32Socket = createSocket('Int32', {parent: intSocket});
export const int64Socket = createSocket('Int64', {parent: intSocket});
export const natSocket = createSocket('Nat', {parent: intSocket});
export const nat8Socket = createSocket('Nat8', {parent: natSocket});
export const nat16Socket = createSocket('Nat16', {parent: natSocket});
export const nat32Socket = createSocket('Nat32', {parent: natSocket});
export const nat64Socket = createSocket('Nat64', {parent: natSocket});
export const blobSocket = createSocket('Blob', {parent: valueSocket});
export const principalSocket = createSocket('Principal', {parent: valueSocket});
export const errorSocket = createSocket('Error', {parent: valueSocket});

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
    let socket = new TypeSocket(name, data);
    sockets.set(name, socket);
    return socket;
}
