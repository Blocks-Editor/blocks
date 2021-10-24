import {identifierType, typeType, valueType} from '../block-types/types';
import {memberBlock} from '../block-patterns/member-patterns';
import {typeCategory} from '../block-categories/categories';

const block = memberBlock({
    title: 'Named Type',
    topRight: 'type',
    category: typeCategory,
    computeTitle(node, editor) {
        let name = editor.compilers.motoko.getInput(node, 'name');
        let type = editor.compilers.type.getInput(node, 'type');
        return name && `${name} = ${editor.compilers.motoko.getTypeString(type)}`;
    },
    inputs: [{
        key: 'name',
        type: identifierType,
    }],
    controls: [{
        key: 'type',
        type: typeType.of(valueType),
    }],
}, {
    toMotoko({visibility, name, type}) {
        let modifiers = [visibility !== 'system' && visibility].filter(m => m).join(' ');

        return `${modifiers && modifiers + ' '}type ${name} = ${type};`;
    },
});
export default block;
