import {compileBlock} from '../block-patterns/compile-patterns';

const block = compileBlock('Type', 'type', type => type?.toTypeString());
export default block;
