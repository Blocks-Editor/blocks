import {SocketHandle} from '../../sockets/SocketHandle';
import {Control} from 'rete-react-render-plugin';
import classNames from 'classnames';
import {paramCase} from 'change-case';
import getPropLabel from '../../../../utils/getPropLabel';
import React from 'react';

export default function PropField({prop, node, hideLeft, hideRight, bindSocket, bindControl}) {
    // const [advanced] = useAdvancedPropsState();
    const advanced = !!node.data['editor:advanced'];////
    // const advanced = true; // Always show advanced props for now

    let input = node.inputs.get(prop.key);
    let output = node.outputs.get(prop.key);
    let control = node.controls.get(prop.key) || (input?.showControl() && input.control);

    if(prop.advanced && !advanced) {
        if(
            (!input || !input.connections.length) &&
            (!output || !output.connections.length) &&
            (!control || control.getValue() === control.getDefaultValue())
        ) {
            return null;
        }
    }

    let leftSocket = input && !hideLeft && (
        <SocketHandle
            type="input"
            socket={input.socket}
            io={input}
            innerRef={bindSocket}
        />
    );
    let rightSocket = output && !hideRight && (
        <SocketHandle
            type="output"
            socket={output.socket}
            io={output}
            innerRef={bindSocket}
        />
    );
    let controlField = control && (
        <Control
            className={input ? 'input-control' : 'control'}
            control={control}
            innerRef={bindControl}
        />
    );

    return (
        <div className={classNames('prop', 'key-' + paramCase(prop.key), !advanced && prop.advanced && 'advanced')}>
            <div className="input">
                {leftSocket}
                {controlField || (leftSocket && (
                    <div className="input-title">{getPropLabel(prop)}</div>
                ))}
            </div>
            <div className="output">
                {!input && (rightSocket && (
                    <div className="output-title">{getPropLabel(prop)}</div>
                ))}
                {rightSocket}
            </div>
        </div>
    );
}