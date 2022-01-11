import {literalBlock} from '../block-patterns/literal-patterns';
import {principalType} from '../block-types/types';
import {importRef} from '../compilers/MotokoCompiler';

export const principalImportRef = importRef('mo:base/Principal');

const block = literalBlock({
    title: 'Principal',
    // customSearch(text) {
    //     if(isPrincipal(text)) {
    //         return {
    //             title: `${text}`,
    //             data: {
    //                 value: text,
    //             },
    //         };
    //     }
    // },
}, principalType, value => `${principalImportRef}.fromText(${JSON.stringify(value)})`);
export default block;
