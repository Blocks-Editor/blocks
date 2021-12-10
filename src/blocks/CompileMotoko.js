import {compileBlock} from '../block-patterns/compile-patterns';

const block = compileBlock('motoko', {
    title: 'Motoko',
    info: 'Compile an expression to Motoko source code.',
    useCases:['debugging', 'learning the Motoko language'],
    global: true,
});
export default block;
