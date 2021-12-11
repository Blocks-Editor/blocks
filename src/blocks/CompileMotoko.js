import {compileBlock} from '../block-patterns/compile-patterns';
import {FOR_DEBUGGING, FOR_LEARNING_MOTOKO} from '../editor/useCases';

const block = compileBlock('motoko', {
    title: 'Motoko',
    info: 'Compile an expression to Motoko source code.',
    useCases: [FOR_DEBUGGING, FOR_LEARNING_MOTOKO],
    global: true,
});
export default block;
