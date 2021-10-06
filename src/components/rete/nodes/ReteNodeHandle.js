import React from 'react';
import {Node, Socket, Control} from 'rete-react-render-plugin';
import {sentenceCase} from 'change-case';

export default class ReteNodeHandle extends Node {
    render() {
        const {node, bindSocket, bindControl} = this.props;
        const {outputs, controls, inputs, selected} = this.state;

        const getLabel = sentenceCase;

        // TODO: icons for different node/connection categories? ('react-icons' includes a lot of options)

        return (
            <div className={`node ${selected}`}>
                <div className="title">{getLabel(/*node.data.label ||*/ node.name)}</div>
                {/* Outputs */}
                {outputs.map(output => (
                    <div className="output" key={output.key}>
                        <div className="output-title">{getLabel(output.name)}</div>
                        <Socket
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
                        <Socket
                            type="input"
                            socket={input.socket}
                            io={input}
                            innerRef={bindSocket}
                        />
                        {!input.showControl() && (
                            <div className="input-title">{getLabel(input.name)}</div>
                        )}
                        {input.showControl() && (
                            <Control
                                className="input-control"
                                control={input.control}
                                innerRef={bindControl}
                            />
                        )}
                    </div>
                ))}
            </div>
        );
    }
}
