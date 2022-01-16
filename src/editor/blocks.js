import {basename} from 'path';
import {getType} from '../block-types/types';
import {defaultCategory, getCategory} from '../block-categories/categories';
import {advancedProp} from '../block-patterns/control-patterns';

// Temp: `/utils/jest/requireContextTransform`
// noinspection JSUnresolvedVariable
if(typeof require.context === 'undefined') {
    const fs = require('fs');
    const path = require('path');

    // noinspection JSUndefinedPropertyAssignment
    require.context = (base = '.', scanSubDirectories = false, regularExpression = /\.js$/) => {
        const files = {};

        const readDirectory = (directory) => {
            fs.readdirSync(directory).forEach((file) => {
                const fullPath = path.resolve(directory, file);
                if(fs.statSync(fullPath).isDirectory()) {
                    if(scanSubDirectories) {
                        readDirectory(fullPath);
                    }
                }
                else if(regularExpression.test(fullPath)) {
                    files[fullPath] = true;
                }
            });
        };

        const Module = (file) => {
            return require(file);
        };
        Module.keys = () => Object.keys(files);

        readDirectory(path.resolve(__dirname, base));
        return Module;
    };
}

const allBlocks = [];
const blockNames = new Set();

// noinspection JSUnresolvedFunction
const blockContext = require.context('../blocks', true, /\.js$/);
blockContext.keys().forEach(path => {
    let name = basename(path, '.js');
    let block = blockContext(path).default;
    block = {...block}; // HMR fix
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

        // TODO: refactor to a distant land
        if(!('editor:advanced' in block.props) && Object.values(block.props).find(prop => prop.advanced)) {
            addProp(block, advancedProp(), 'control');
        }

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
            if(!prop.type && (prop.input || prop.output) && prop.control) {
                throw new Error(`Type not found for ${block.name}.${prop.key}`);
            }
            if(prop.type) {
                try {
                    prop.type = getType(prop.type);
                }
                catch(err) {
                    console.error(`Error while getting type for ${block.name}.${prop.key}`);
                    throw err;
                }
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

function addProp(block, prop, type) {
    if(prop.key && block.props[prop.key] === prop) {
        return;
    }
    if(block.props.hasOwnProperty(prop.key)) {
        throw new Error(`Duplicate prop in ${block.name}: ${prop.key}`);
    }
    prop[type] = prop[type] || true;
    block.props[prop.key] = prop;
}


export const BLOCK_MAP = new Map(allBlocks.map(block => [block.name, block]));

window.BLOCK_MAP = BLOCK_MAP; // Browser debugging

// Post-initialization
for(let block of BLOCK_MAP.values()) {
    if(block.shortcuts) {
        block.shortcuts.forEach(s => {
            if(!s.block) {
                throw new Error(`Shortcut in ${block.name} requires a \`block\` attribute`);
            }
            s.block = getBlock(s.block);
        });
    }
    else {
        block.shortcuts = [];
    }
}

export function getBlock(name) {
    if(!name) {
        throw new Error(`Block cannot be ${name}`);
    }
    if(typeof name === 'string') {
        if(!BLOCK_MAP.has(name)) {
            throw new Error(`Block does not exist: ${name}`);
        }
        return BLOCK_MAP.get(name);
    }
    return name;
}