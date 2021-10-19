import {basename} from 'path';
import {getType} from '../block-types/types';
import {defaultCategory, getCategory} from '../block-categories/categories';

const allBlocks = [];
const blockNames = new Set();
// noinspection JSUnresolvedFunction
const blockContext = require.context('../blocks', true, /\.js$/);
blockContext.keys().forEach(path => {
    let name = basename(path, '.js');
    let block = blockContext(path).default;
    block = {...block}; // Enable hot-reload
    if(block) {
        block.name = name;
        if(blockNames.has(name)) {
            console.error(`Duplicate block name: ${name}`);
            return;
        }
        block.category = block.category ? getCategory(block.category) : defaultCategory;
        block.props = block.props || {};
        for(let [key, prop] of Object.entries(block.props)) {
            if(prop.key && prop.key !== key) {
                throw new Error(`Prop key mismatch: ${key} != ${prop.key}`);
            }
            prop.key = key;
        }

        // `outputs` prioritized over `inputs`
        addProps(block, block.outputs, 'output');
        addProps(block, block.inputs, 'input');
        addProps(block, block.controls, 'control');

        // Rearrange block inputs/outputs/controls
        block.inputs = [];
        block.outputs = [];
        block.controls = [];

        for(let [key, prop] of Object.entries(block.props)) {
            prop.key = key;
            // `output` prioritized over `input`
            if(prop.output) {
                if(!block.outputs.includes(prop)) {
                    block.outputs.push(prop);
                }
            }
            else if(prop.input) {
                if(!block.inputs.includes(prop)) {
                    block.inputs.push(prop);
                }
            }
            else if(prop.control) {
                if(!block.controls.includes(prop)) {
                    block.controls.push(prop);
                }
            }
        }

        // Type deserialization
        for(let prop of Object.values(block.props)) {
            if(prop.input || prop.output) {
                if(!prop.type) {
                    throw new Error(`Type not found for ${block.name} : ${prop.key}`);
                }
                prop.type = getType(prop.type);
            }
        }

        blockNames.add(block.name);
        allBlocks.push(block);
    }
});

function addProps(block, propList, type) {
    if(propList) {
        for(let prop of propList) {
            if(prop.key && block.props[prop.key] === prop) {
                continue;
            }
            if(block.props.hasOwnProperty(prop.key)) {
                throw new Error(`Duplicate prop in ${block.name}: ${prop.key}`);
            }
            prop[type] = prop[type] || true;
            block.props[prop.key] = prop;
        }
    }
}

export const BLOCK_MAP = new Map(allBlocks.map(block => [block.name, block]));