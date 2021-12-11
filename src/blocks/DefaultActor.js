import {containerType} from '../block-types/types';
import {actorCategory} from '../block-categories/categories';
import compileGlobalMotoko from '../compilers/global/compileGlobalMotoko';

const block = {
    info: 'The top-level actor for the application. All member blocks reference this actor by default.',
    category: actorCategory,
    topLeft: 'actor',
    // global: true,
    inputs: [],
    outputs: [{
        key: 'actor',
        type: containerType,
        toMotoko(_, node, compiler) {
            return compileGlobalMotoko(compiler.editor);
        },
    }],
};
export default block;