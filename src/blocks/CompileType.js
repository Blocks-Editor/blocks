import {compileBlock} from '../block-patterns/compile-patterns';

const block = compileBlock('type', {
    title: 'Type',
    info: 'Display the type signature of an expression.',
    useCases:['debugging', 'learning the Motoko type system'],
    global: true,
}, type => type?.toTypeString());
export default block;
