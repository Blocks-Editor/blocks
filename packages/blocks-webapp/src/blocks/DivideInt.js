import {operatorCategory} from '../block-categories/categories';
import {intType} from '../block-types/types';
import {importRef} from '../compilers/MotokoCompiler';

export const intImportRef = importRef('mo:base/Int');

const block = {
    title: `(a // b)`,
    category: operatorCategory,
    topRight: 'result',
    inputs: [{
        key: 'left',
        title: 'a',
        type: intType,
    }, {
        key: 'right',
        title: 'b',
        type: intType,
    }],
    outputs: [{
        key: 'result',
        type: intType,
        toMotoko({left, right}) {
            return `${intImportRef}.div(${left}, ${right})`;
        },
        // inferType({left, right}) {
        //     return left.getSharedType(right);
        // },
    }],
};
export default block;