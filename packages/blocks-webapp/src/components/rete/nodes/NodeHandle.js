import React from 'react';
import {Node} from 'rete-react-render-plugin';
import {SocketHandle} from '../sockets/SocketHandle';
import {getBlock} from '../../../editor/blocks';
import classNames from 'classnames';
import DynamicTitle from './parts/DynamicTitle';
import getNodeLabel from '../../../utils/getNodeLabel';
import getPropLabel from '../../../utils/getPropLabel';
import {ButtonGroup} from 'react-bootstrap';
import ShortcutButton from './parts/ShortcutButton';
import PropField from './parts/PropField';

export default class NodeHandle extends Node {
    render() {
        let {editor, node, bindSocket, bindControl} = this.props;
        let {selected} = this.state;

        let block = getBlock(node.name);
        if(block.component) {
            let Component = block.component;
            return <Component block={block} nodeHandle={this}/>;
        }

        // Properties for the top left/right corners
        let topLeft = block.topLeft && node.inputs.get(block.topLeft);
        let topRight = block.topRight && node.outputs.get(block.topRight);

        let title = getNodeLabel(node, editor, true);
        if(block.computeTitle) {
            title = <DynamicTitle editor={editor} node={node} block={block} fallback={title}/>;
        }

        let getBindControl = prop => (ref, ...args) => {
            let result = bindControl(ref, ...args);
            if(ref) {
                // Custom hover text
                ref.title = getPropLabel(prop);
            }
            return result;
        };

        let width = 32 * (node.data['editor:width'] || block.width || 6) - 3;

        return (
            <div style={{width}} className={classNames('node', selected, block.className)}>
                <div className="header d-flex">
                    {topLeft && (
                        <div>
                            <SocketHandle
                                type="input"
                                socket={topLeft.socket}
                                io={topLeft}
                                innerRef={bindSocket}
                            />
                        </div>
                    )}
                    <div
                        className="title d-inline-block flex-grow-1 text-nowrap overflow-hidden"
                        style={{color: block.category.data.color}}>
                        {block.icon && (
                            // TODO: globally improve react-icons render logic
                            <span className="d-inline-block pe-1" style={{transform: 'translateY(-.2em)'}}>
                                {React.createElement(block.icon)}
                            </span>
                        )}
                        {title}
                    </div>
                    {topRight && (
                        <div>
                            <SocketHandle
                                type="output"
                                socket={topRight.socket}
                                io={topRight}
                                innerRef={bindSocket}
                            />
                        </div>
                    )}
                </div>
                {block.shortcuts.length > 0 && (
                    <ButtonGroup className="px-4 py-1 w-100" style={{background: '#0002'}}>
                        {block.shortcuts.map((shortcut, i) => (
                            <ShortcutButton key={i} editor={editor} node={node} shortcut={shortcut}/>
                        ))}
                    </ButtonGroup>
                )}
                {Object.values(block.props)
                    .filter(prop => !prop.hidden && (prop.control || ((!topLeft || prop.key !== block.topLeft) && (!topRight || prop.key !== block.topRight))))
                    .map(prop => (
                        <PropField
                            key={prop.key}
                            prop={prop}
                            node={node}
                            hideLeft={prop.key === block.topLeft}
                            hideRight={prop.key === block.topRight}
                            bindSocket={bindSocket}
                            bindControl={getBindControl(prop)}
                        />
                    ))}
            </div>
        );
    }
}
