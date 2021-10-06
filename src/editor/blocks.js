import {basename} from 'path';

const allBlocks = [];
const blockNames = new Set();
// noinspection JSUnresolvedFunction
const blockContext = require.context('../blocks', true, /\.js$/);
blockContext.keys().forEach(path => {
    let name = basename(path, '.js');
    // let block = {
    //     name,
    //     inputs: [],
    //     outputs: [],
    //     controls: [],
    //     ...blockContext(path).default,
    // };
    let block = blockContext(path).default;
    block.name = name;
    if(blockNames.has(name)) {
        console.error(`Duplicate block name: ${name}`);
        return;
    }
    blockNames.add(block.name);
    allBlocks.push(block);
});

export const BLOCK_MAP = new Map(allBlocks.map(block => [block.name, block]));