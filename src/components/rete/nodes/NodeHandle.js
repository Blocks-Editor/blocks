import React from 'react';
import {Control, Node} from 'rete-react-render-plugin';
import {SocketHandle} from '../sockets/SocketHandle';
import getDefaultLabel from '../../../utils/getDefaultLabel';
import {BLOCK_MAP} from '../../../editor/blocks';
import classNames from 'classnames';
import {paramCase} from 'change-case';
import DynamicTitle from './parts/DynamicTitle';
import getNodeTitle from '../../../utils/getNodeTitle';

function PropHandle({prop, node, block, hideLeft, hideRight, bindSocket, bindControl}) {
    let input = node.inputs.get(prop.key);
    let output = node.outputs.get(prop.key);
    let control = node.controls.get(prop.key) || (input?.showControl() && input.control);

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
        <div className={classNames('prop', 'key-' + paramCase(prop.key))}>
            <div className="input">
                {leftSocket}
                {controlField || (leftSocket && (
                    <div className="input-title">{prop.title || getDefaultLabel(prop.key)}</div>
                ))}
            </div>
            <div className="output">
                {!input && (rightSocket && (
                    <div className="output-title">{prop.title || getDefaultLabel(prop.key)}</div>
                ))}
                {rightSocket}
            </div>
        </div>
    );
}

export default class NodeHandle extends Node {
    render() {
        const {editor, node, bindSocket, bindControl} = this.props;
        const {/*outputs, controls, inputs, */selected} = this.state;

        let block = BLOCK_MAP.get(node.name);
        if(!block) {
            throw new Error(`Block does not exist: ${node.name}`);
        }

        let topLeft = block.topLeft && node.inputs.get(block.topLeft);
        let topRight = block.topRight && node.outputs.get(block.topRight);

        // let title = node.meta.title || getDefaultLabel(node.name);
        let title = getNodeTitle(node, editor, true);
        if(block.computeTitle) {
            title = <DynamicTitle editor={editor} node={node} block={block} fallback={title}/>;
        }

        return (
            <div className={classNames('node', selected)}>
                <div className="header">
                    {topLeft && (
                        <div style={{float: 'left'}}>
                            <SocketHandle
                                type="input"
                                socket={topLeft.socket}
                                io={topLeft}
                                innerRef={bindSocket}
                            />
                        </div>
                    )}
                    {topRight && (
                        <div style={{float: 'right'}}>
                            <SocketHandle
                                type="output"
                                socket={topRight.socket}
                                io={topRight}
                                innerRef={bindSocket}
                            />
                        </div>
                    )}
                    <div className="title" style={{color: block.category.data.color}}>{title}</div>
                </div>
                {Object.values(block.props)
                    .filter(prop => prop.control || ((!topLeft || prop.key !== block.topLeft) && (!topRight || prop.key !== block.topRight)))
                    .map(prop => (
                        <PropHandle
                            key={prop.key}
                            prop={prop}
                            node={node}
                            block={block}
                            hideLeft={prop.key === block.topLeft}
                            hideRight={prop.key === block.topRight}
                            bindSocket={bindSocket}
                            bindControl={bindControl}
                        />
                    ))}
            </div>
        );
    }
}
