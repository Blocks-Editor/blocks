import React from 'react';
import {Control, Node} from 'rete-react-render-plugin';
import {SocketHandle} from '../sockets/SocketHandle';
import getDefaultLabel from '../../../utils/getDefaultLabel';

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

function IOHandle({type, io, bindSocket, bindControl}) {
    return (
        <div className={type}>
            {type === 'output' && (
                <div className="output-title">{io.name}</div>
            )}
            <SocketHandle
                type={type}
                socket={io.socket}
                io={io}
                innerRef={bindSocket}
            />
            {type === 'input' && (
                io.showControl() ? (
                    <ControlWrapper>
                        <Control
                            className="input-control"
                            control={io.control}
                            innerRef={bindControl}
                        />
                    </ControlWrapper>
                ) : (
                    <div className="input-title">{io.name}</div>
                )
            )}
        </div>
    );
}

export default class NodeHandle extends Node {
    render() {
        const {node, bindSocket, bindControl} = this.props;
        const {outputs, controls, inputs, selected} = this.state;

        // TODO: icons for different node/connection categories? ('react-icons' includes a lot of options)

        return (
            <div className={`node ${selected}`}>
                <div className="title">{node.data.title || getDefaultLabel(node.name)}</div>
                {/* Outputs */}
                {outputs.map(output => (
                    <IOHandle
                        key={output.key}
                        type="output"
                        io={output}
                        bindSocket={bindSocket}
                        bindControl={bindControl}
                    />
                ))}
                {/* Inputs */}
                {inputs.map(input => (
                    <IOHandle
                        key={input.key}
                        type="input"
                        io={input}
                        bindSocket={bindSocket}
                        bindControl={bindControl}
                    />
                ))}
                {/* Controls */}
                {controls.map(control => (
                    <ControlWrapper>
                        <Control
                            className="control"
                            key={control.key}
                            control={control}
                            innerRef={bindControl}
                        />
                    </ControlWrapper>
                ))}
            </div>
        );
    }
}
