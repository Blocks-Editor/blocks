import {getBlock} from './blocks';

/* eslint-disable quote-props */
const shortcutKeys = {
    'c': 'Comment',
    'v': 'CommentRegion',

    // Arithmetic
    '-': 'Subtract',
    '=': 'Add',
    '8': 'Multiply',
    '/': 'Divide',

    // Boolean logic
    '7': 'And',
    '\\': 'Or',
    '1': 'Not',

    // Members
    'f': 'Function',
    's': 'State',
    'p': 'MainParameter',

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
    'd': 'LiteralFloat',
    // 's': 'LiteralText',
    'a': 'NewArray',
    'm': 'NewHashMap',

    // Optionals
    'o': 'Optional',
    'u': 'OptionalUnwrap',
};

export const SHORTCUT_KEY_MAP = new Map(Object.entries(shortcutKeys).map(([k, v]) => [k, getBlock(v)]));

export const SHORTCUT_BLOCK_FROM_KEY_MAP = new Map([...SHORTCUT_KEY_MAP.entries()].map(([k, v]) => [v, k]));
