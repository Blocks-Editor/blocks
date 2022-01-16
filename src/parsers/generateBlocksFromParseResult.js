import {asyncType, customType, optionalType, TYPE_MAP, unitType} from '../block-types/types';

export default function generateBlocksFromParseResult(result) {
    const json = {
        name: '(Generated)',
        nodes: {},
    };

    result.imports.forEach(({name, path}, i) => {

    });
    result.params.forEach(({name, type}, i) => {
        json.nodes[`main_param_${name}`] = {
            type: 'MainParameter',
            position: [i * 300, -300],
            data: {
                name,
                type: parseType(type),
            },
        };
    });
    result.types.forEach(({name, type, visibility}, i) => {
        json.nodes[`type_${name}`] = {
            type: 'TypeMember',
            position: [-500, i * 300],
            data: {
                name,
                typeInput: parseType(type),
                visibility,
            },
        };
    });
    result.states.forEach(({name, type, initialValue, visibility, stable, readonly}, i) => {
        const x = -1000;
        const y = i * 300;
        json.nodes[`state_${name}`] = {
            type: 'State',
            position: [x, y],
            data: {
                name,
                visibility,
                stable,
                readonly,
                // 'editor:advanced': true,
            },
        };
        json.nodes[`initial_${name}`] = {
            type: 'CodeValue',
            position: [x - 500, y],
            data: {
                type: parseType(type),
                expression: initialValue,
            },
            outputs: {
                result: [{
                    node: `state_${name}`,
                    input: 'initialValue',
                }],
            },
        };
    });

    const showFunction = ({name: funcName, params, returnType, visibility, shared, query, body}, i) => {
        returnType = parseType(returnType);
        if(visibility === 'public' && asyncType.isSubtype(returnType)) {
            returnType = returnType.generics[0];
        }

        const x = functionX;
        const y = i * 350;
        json.nodes[`func_${funcName}`] = {
            type: 'Function',
            position: [x, y],
            data: {
                name: funcName,
                visibility,
                shared,
                query,
                // 'editor:advanced': true,
            },
            outputs: {
                body: [{
                    node: `body_${funcName}`,
                    input: 'before',
                }],
                params: params.map(({name}) => ({
                    node: `param_${funcName}_${name}`,
                    input: 'param',
                })),
            },
        };
        params.forEach(({name, type}, i) => {
            json.nodes[`param_${funcName}_${name}`] = {
                type: 'Parameter',
                position: [x + 250, y + 20 + Math.max(0, (2 - params.length) * 60) + i * 120],
                data: {
                    name,
                    type: parseType(type),
                },
            };
        });
        json.nodes[`body_${funcName}`] = {
            type: 'CodeStatement',
            position: [x + 500, y],
            data: {
                type: returnType,
                expression: body,
            },
        };
    };

    let functionX = 0;
    result.functions.filter(({visibility}) => visibility !== 'public').forEach(showFunction);
    functionX += 1500;
    result.functions.filter(({visibility}) => visibility === 'public').forEach(showFunction);

    return json;
}

function parseType(type) {
    type = type.trim();

    if(type === '()') {
        return unitType;
    }
    if(type.startsWith('async ')) {
        return asyncType.of(parseType(type.substring('async '.length)));
    }
    if(type.startsWith('?')) {
        return optionalType.of(parseType(type.substring(1)));
    }
    return TYPE_MAP.get(type) || customType;
}