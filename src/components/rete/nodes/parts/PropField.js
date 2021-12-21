import {SocketHandle} from '../../sockets/SocketHandle';
import {Control} from 'rete-react-render-plugin';
import classNames from 'classnames';
import {paramCase} from 'change-case';
import getPropLabel from '../../../../utils/getPropLabel';
import React from 'react';
import useReactTooltip from '../../../../hooks/useReactTooltip';
import useLearningModeState from '../../../../hooks/persistent/useLearningModeState';
import getInfoText from '../../../../utils/getInfoText';

export default function PropField({prop, node, hideLeft, hideRight, bindSocket, bindControl}) {

    const [learningMode] = useLearningModeState();

    const advanced = !!node.data['editor:advanced'];

    const input = node.inputs.get(prop.key);
    const output = node.outputs.get(prop.key);
    const control = node.controls.get(prop.key) || (input?.showControl() && input.control);

    useReactTooltip();

    if(prop.advanced && !advanced) {
        if(
            (!input || !input.connections.length) &&
            (!output || !output.connections.length) &&
            (!control || control.getValue() === control.getDefaultValue())
        ) {
            return null;
        }
    }

    const leftSocket = input && !hideLeft && (
        <SocketHandle
            type="input"
            socket={input.socket}
            propKey={prop.key}
            io={input}
            innerRef={bindSocket}
        />
    );
    const rightSocket = output && !hideRight && (
        <SocketHandle
            type="output"
            propKey={prop.key}
            socket={output.socket}
            io={output}
            innerRef={bindSocket}
        />
    );
    const controlField = control && (
        <Control
            className={input ? 'input-control' : 'control'}
            control={control}
            innerRef={bindControl}
        />
    );

    const tooltip = learningMode ? getInfoText(prop.info) : null;
    const tooltipDelay = 100;

    return (
        <div
            className={classNames('prop', 'key-' + paramCase(prop.key), !advanced && prop.advanced && 'advanced')}
            data-tip={tooltip}
            data-delay-show={tooltipDelay}>
            <div className="input">
                {leftSocket}
                {controlField || (leftSocket && (
                    <div className="input-title">
                        {getPropLabel(prop)}
                    </div>
                ))}
            </div>
            <div className="output">
                {!input && (rightSocket && (
                    <div className="output-title">
                        {getPropLabel(prop)}
                    </div>
                ))}
                {rightSocket}
            </div>
        </div>
    );
}