import {getBlock} from './blocks';

/* eslint-disable quote-props */
const shortcutKeys = {
    'c': 'Comment',
    'd': 'CommentRegion',

    // Arithmetic
    '-': 'Subtract',
    '=': 'Add',
    '8': 'Multiply',
    '/': 'Divide',

    // Boolean logic
    '7': 'And',
    '\\': 'Or',
    '1': 'Not',

    // Control flow
    'r': 'Return',

    // Literal values
    ',': 'LiteralTuple',
    '.': 'LiteralIdentifier',
    '\'': 'LiteralText',///
    'x': 'CodeValue',
    'b': 'LiteralBool',
    'n': 'LiteralNat',
    'i': 'LiteralInt',
    'f': 'LiteralFloat',
    // 's': 'LiteralText',
    'a': 'NewArray',
    'm': 'NewHashMap',

    // Optionals
    'o': 'Optional',
    'u': 'OptionalUnwrap',
};

export const SHORTCUT_KEYS = new Map(Object.entries(shortcutKeys).map(([k, v]) => [k, getBlock(v)]));
