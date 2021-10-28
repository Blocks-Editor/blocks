import {typeType, valueType} from '../block-types/types';
import {computeMemberName, memberBlock} from '../block-patterns/member-patterns';
import {typeCategory} from '../block-categories/categories';

const block = memberBlock({
    title: 'Named Type',
    category: typeCategory,
    topRight: 'type',
    shortcuts: [{
        block: 'TypeMemberReference',
        nodeKey: 'typeNode',
    }],
    computeTitle(node, editor) {
        let name = computeMemberName(node, editor);
        let type = editor.compilers.type.getInput(node, 'type');
        let typeString = editor.compilers.motoko.getTypeString(type);
        return `${name || '(?)'} = ${typeString}`;
    },
    outputs: [{
        key: 'type',
        type: typeType.of(valueType),
        control: true,
        inferType({type}) {
            if(!type.isAbstract()) {
                return typeType.of(type);
            }
            // if(!type) {
            //     return;
            // }
            // let valueType = type.generics[0];
            // console.log(valueType)
            // // if(!valueType.isAbstract()) {
            // return valueType;
            // // }
        },
    }],
}, {
    toMotoko({visibility, name, type}) {
        let modifiers = [visibility !== 'system' && visibility].filter(m => m).join(' ');

        return `${modifiers && modifiers + ' '}type ${name} = ${type};`;
    },
});
export default block;
