import {valueType} from '../block-types/types';
import {statementBlock} from '../block-patterns/statement-patterns';
import {importRef} from '../compilers/MotokoCompiler';
import {FaSearch} from 'react-icons/fa';

const debugImportRef = importRef('mo:base/Debug');

const block = statementBlock({
    title: 'Print (Debug)',
    info: 'Display a value in the debug console (when deployed)',
    // category: debugCategory,
    icon: FaSearch,
    inputs: [{
        key: 'value',
        type: valueType,
    }],
}, ({value}) => {
    return `${debugImportRef}.print(debug_show(${value}));`;
});
export default block;
