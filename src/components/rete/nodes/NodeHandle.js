import React from 'react';
import {Control, Node} from 'rete-react-render-plugin';
import {SocketHandle} from '../sockets/SocketHandle';
import getDefaultLabel from '../../../utils/getDefaultLabel';

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
                    <div className="output" key={output.key}>
                        <div className="output-title">{getDefaultLabel(output.name)}</div>
                        <SocketHandle
                            type="output"
                            socket={output.socket}
                            io={output}
                            innerRef={bindSocket}
                        />
                    </div>
                ))}
                {/* Controls */}
                {controls.map(control => (
                    <Control
                        className="control"
                        key={control.key}
                        control={control}
                        innerRef={bindControl}
                    />
                ))}
                {/* Inputs */}
                {inputs.map(input => (
                    <div className="input" key={input.key}>
                        <SocketHandle
                            type="input"
                            socket={input.socket}
                            io={input}
                            innerRef={bindSocket}
                        />
                        {input.showControl() ? (
                            <Control
                                className="input-control"
                                control={input.control}
                                innerRef={bindControl}
                            />
                        ) : (
                            <div className="input-title">{getDefaultLabel(input.name)}</div>
                        )}
                    </div>
                ))}
            </div>
        );
    }
}
