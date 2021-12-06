import {typeCategory} from '../block-categories/categories';
import {customType, referenceType, typeType, valueType} from '../block-types/types';
import {FaPencilAlt} from 'react-icons/fa';

const block = {
    title: 'Custom Type',
    category: typeCategory,
    topRight: 'value',
    icon: FaPencilAlt,
    hidden: true,////
    inputs: [{
        key: 'reference',
        type: referenceType,
    }, {
        key: 'generics',
        type: typeType.of(valueType),
        multi: true,
    }],
    outputs: [{
        key: 'value',
        type: typeType.of(customType),
        inferType(args, node, compiler) {
            let reference = compiler.editor.compilers.motoko.getInput(node, 'reference');
            let generics = compiler.editor.compilers.type.getInput(node, 'generics');
            if(!reference) {
                return;
            }
            return customType.of(...generics).withMeta({name: reference}); ///
        },
    }],
};
export default block;
