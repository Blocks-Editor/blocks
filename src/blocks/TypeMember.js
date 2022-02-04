import {identifierType, typeType, valueType} from '../block-types/types';
import {getUserDefinedName, memberBlock, visibilityControlProp} from '../block-patterns/member-patterns';
import {typeCategory} from '../block-categories/categories';
import {TYPE_PRIORITY} from '../compilers/utils/compileGlobalMotoko';

const block = memberBlock({
    title: 'Named Type',
    info: 'An actor-level type definition',
    category: typeCategory,
    topRight: 'type',
    global: true,
    memberPriority: TYPE_PRIORITY,
    shortcuts: [{
        block: 'TypeMemberReference',
        nodeKey: 'typeNode',
    }],
    computeTitle(node, editor) {
        let name = getUserDefinedName(node, editor);
        let type = editor.compilers.type.getInput(node, 'typeInput');//?.generics[0];
        return type && `${name || '(?)'} = ${editor.compilers.motoko.getTypeString(type)}`;
    },
    inputs: [{
        key: 'name',
        type: identifierType,
    }, {
        key: 'typeInput',
        title: 'Definition',
        type: typeType.of(valueType),
    }],
    outputs: [{
        key: 'type',
        type: typeType.of(valueType),
        inferType({name, typeInput}) {
            if(!typeInput.isAbstract()) {
                // return typeType.of(typeInput);
                return typeInput.withMeta({name});///
            }
        },
        toMotoko({name}) {
            return name;
        },
    }],
    controls: [
        visibilityControlProp(),
    ],
}, {
    toMotoko({visibility, name, typeInput}, node, compiler) {
        const modifiers = [visibility !== 'system' && visibility].filter(m => m).join(' ');

        return `${modifiers && modifiers + ' '}type ${name} = ${typeInput};`;
    },
});
export default block;
