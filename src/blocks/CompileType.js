import {compileBlock} from '../block-patterns/compile-patterns';
import {FOR_DEBUGGING, FOR_LEARNING_MOTOKO} from '../editor/useCases';

const block = compileBlock('type', {
    title: 'Type',
    info: 'Display the type signature of an expression.',
    useCases: [FOR_DEBUGGING, FOR_LEARNING_MOTOKO],
    // global: true,
}, type => type?.toTypeString());
export default block;
