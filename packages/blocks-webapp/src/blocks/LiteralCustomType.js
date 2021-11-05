import {typeCategory} from '../block-categories/categories';
import {customType, identifierType, typeType, valueType} from '../block-types/types';
import {FaPencilAlt} from 'react-icons/fa';

const block = {
    title: 'Custom Type',
    category: typeCategory,
    topRight: 'value',
    icon: FaPencilAlt,
    hidden: true,////
    inputs: [{
        key: 'name',
        type: identifierType,
    }, {
        key: 'generics',
        type: typeType.of(valueType),
        multi: true,
    }],
    outputs: [{
        key: 'value',
        type: typeType.of(customType),
        inferType(args, node, compiler) {
            let name = compiler.editor.compilers.motoko.getInput(node, 'name');
            let generics = compiler.editor.compilers.type.getInput(node, 'generics');
            if(!name) {
                return;
            }
            let type = customType.of(...generics).withMeta({}); // Ensure subtype
            type.name = name;
            // return typeType.of(value);
            return type;
        },
    }],
};
export default block;
