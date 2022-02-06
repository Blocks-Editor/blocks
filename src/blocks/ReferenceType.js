import {customType, referenceType, typeType, valueType} from '../block-types/types';
import {FOR_CUSTOM_LOGIC} from '../editor/useCases';
import {referenceCategory} from '../block-categories/categories';

const block = {
    title: 'Type',
    info: 'Convert a code reference to a type',
    category: referenceCategory,
    // icon: referenceCategory.data.icon,
    useCases: [FOR_CUSTOM_LOGIC],
    topLeft: 'reference',
    topRight: 'type',
    width: 3,
    // computeTitle(node, editor) {
    //     return editor.compilers.motoko.getInput(node, 'reference');
    // },
    inputs: [{
        key: 'reference',
        type: referenceType,
    }],
    outputs: [{
        key: 'type',
        type: typeType.of(valueType),
        toMotoko({reference}) {
            return reference;
        },
        inferType(_, node, compiler) {
            const name = compiler.editor.compilers.motoko.getInput(node, 'reference');
            if(!name) {
                return;
            }
            return customType.withMeta({name});
        },
    }],
};
export default block;
