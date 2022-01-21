import {nat32Type, textType} from '../block-types/types';
import {FaHashtag} from 'react-icons/fa';
import {importRef} from '../compilers/MotokoCompiler';

export const textImportRef = importRef('mo:base/Text');

const block = {
    title: 'Hash (Text)',
    // category: textCategory,
    icon: FaHashtag,
    inputs: [{
        key: 'value',
        type: textType,
    }],
    outputs: [{
        key: 'hash',
        type: nat32Type,
        toMotoko({value}) {
            return `${textImportRef}.hash(${value})`;
        },
    }],
};
export default block;
