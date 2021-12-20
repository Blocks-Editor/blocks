import {principalType} from '../block-types/types';
import {paramCategory} from '../block-categories/categories';
import {FOR_CONFIGURATION} from '../editor/useCases';
import {mainSharedRef} from '../compilers/utils/compileGlobalMotoko';

const block = {
    info: 'The owner of the top-level smart contract',
    useCases: [FOR_CONFIGURATION],
    category: paramCategory,
    global: true,
    outputs: [{
        key: 'caller',
        type: principalType,
        toMotoko(args, node, compiler) {
            return `${mainSharedRef(compiler.editor)}.caller`;
        },
    }],
};
export default block;