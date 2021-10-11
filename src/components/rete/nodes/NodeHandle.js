import React from 'react';
import {Control, Node} from 'rete-react-render-plugin';
import {SocketHandle} from '../sockets/SocketHandle';
import getDefaultLabel from '../../../utils/getDefaultLabel';
import {BLOCK_MAP} from '../../../editor/blocks';
import classNames from 'classnames';
import {paramCase} from 'change-case';

// Prevents dragging node when highlighting control text
function ControlWrapper({children}) {
    return (
        <span
            style={{cursor: 'default'}}
            ref={ref => ref && ref.addEventListener('pointerdown', event => event.stopPropagation())}>
            {children}
        </span>
    );
}

// function IOHandle({type, io, bindSocket, bindControl}) {
//     return (
//         <div className={type}>
//             {type === 'output' && (
//                 <div className="output-title">{io.name}</div>
//             )}
//             <SocketHandle
//                 type={type}
//                 socket={io.socket}
//                 io={io}
//                 innerRef={bindSocket}
//             />
//             {type === 'input' && (
//                 io.showControl() ? (
//                     <ControlWrapper>
//                         <Control
//                             className="input-control"
//                             control={io.control}
//                             innerRef={bindControl}
//                         />
//                     </ControlWrapper>
//                 ) : (
//                     <div className="input-title">{io.name}</div>
//                 )
//             )}
//         </div>
//     );
// }

function PropHandle({prop, node, block, bindSocket, bindControl}) {
    let input = node.inputs.get(prop.key);
    let output = node.outputs.get(prop.key);
    let control = node.controls.get(prop.key) || (input?.showControl() && input.control);

    let inputSocket = input && (
        <SocketHandle
            type="input"
            socket={input.socket}
            io={input}
            innerRef={bindSocket}
        />
    );
    let outputSocket = output && (
        <SocketHandle
            type="output"
            socket={output.socket}
            io={output}
            innerRef={bindSocket}
        />
    );
    let controlField = control && (
        <ControlWrapper>
            <Control
                className={input ? 'input-control' : 'control'}
                control={control}
                innerRef={bindControl}
            />
        </ControlWrapper>
    );

    return (
        <div className={classNames('prop', 'key-' + paramCase(prop.key))}>
            <div className="input">
                {inputSocket}
                {controlField || (input && (
                    <div className="input-title">{prop.title || getDefaultLabel(prop.key)}</div>
                ))}
            </div>
            <div className="output">
                {!input && (output && (
                    <div className="output-title">{prop.title || getDefaultLabel(prop.key)}</div>
                ))}
                {outputSocket}
            </div>
        </div>
    );
}

export default class NodeHandle extends Node {
    render() {
        const {node, bindSocket, bindControl} = this.props;
        const {/*outputs, controls, inputs, */selected} = this.state;

        let block = BLOCK_MAP.get(node.name);
        if(!block) {
            throw new Error(`Block does not exist: ${node.name}`);
        }

        // TODO: icons for different node/connection categories? ('react-icons' includes a lot of options)

        return (
            <div className={`node ${selected}`}>
                <div className="title">{node.data.title || getDefaultLabel(node.name)}</div>
                {/*/!* Outputs *!/*/}
                {/*{outputs.map(output => (*/}
                {/*    <IOHandle*/}
                {/*        key={output.key}*/}
                {/*        type="output"*/}
                {/*        io={output}*/}
                {/*        bindSocket={bindSocket}*/}
                {/*        bindControl={bindControl}*/}
                {/*    />*/}
                {/*))}*/}
                {/*/!* Inputs *!/*/}
                {/*{inputs.map(input => (*/}
                {/*    <IOHandle*/}
                {/*        key={input.key}*/}
                {/*        type="input"*/}
                {/*        io={input}*/}
                {/*        bindSocket={bindSocket}*/}
                {/*        bindControl={bindControl}*/}
                {/*    />*/}
                {/*))}*/}
                {/*/!* Controls *!/*/}
                {/*{controls.map(control => (*/}
                {/*    <ControlWrapper key={control.key}>*/}
                {/*        <Control*/}
                {/*            className="control"*/}
                {/*            control={control}*/}
                {/*            innerRef={bindControl}*/}
                {/*        />*/}
                {/*    </ControlWrapper>*/}
                {/*))}*/}
                {Object.values(block.props).map(prop => (
                    <PropHandle
                        key={prop.key}
                        prop={prop}
                        node={node}
                        block={block}
                        bindSocket={bindSocket}
                        bindControl={bindControl}
                    />
                ))}
            </div>
        );
    }
}
