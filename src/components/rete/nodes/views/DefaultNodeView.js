import React from 'react';
import getNodeLabel from '../../../../utils/getNodeLabel';
import DynamicTitle from '../parts/DynamicTitle';
import getPropLabel from '../../../../utils/getPropLabel';
import classNames from 'classnames';
import {SocketHandle} from '../../sockets/SocketHandle';
import {ButtonGroup} from 'react-bootstrap';
import ShortcutButton from '../parts/ShortcutButton';
import PropField from '../parts/PropField';
import useLearningModeState from '../../../../hooks/persistent/useLearningModeState';
import useReactTooltip from '../../../../hooks/useReactTooltip';
import getInfoText from '../../../../utils/getInfoText';

export default function DefaultNodeView({block, nodeHandle}) {
    const [learningMode] = useLearningModeState();

    const {editor, node, bindSocket, bindControl} = nodeHandle.props;
    const {selected} = nodeHandle.state;

    const getTopIO = (side, ioSide) => block[side] && block[side] in block.props && !block.props[block[side]].hidden && node[ioSide].get(block[side]);

    // Properties for the top left/right corners
    let topLeft = getTopIO('topLeft', 'inputs');
    let topRight = getTopIO('topRight', 'outputs');

    let title = getNodeLabel(node, editor, true);
    if(block.computeTitle) {
        title = <DynamicTitle editor={editor} node={node} block={block} fallback={title} showInfo={learningMode}/>;
    }

    const getBindControl = prop => (ref, ...args) => {
        const result = bindControl(ref, ...args);
        if(ref) {
            // Custom hover text
            ref.title = getPropLabel(prop);
        }
        return result;
    };

    const filterProp = prop => {
        if(prop.hidden) {
            return false;
        }
        return prop.control || ((!topLeft || prop.key !== block.topLeft) && (!topRight || prop.key !== block.topRight));
    };

    const borderColor = node.data['editor:border'];

    const width = 32 * (node.data['editor:width'] || block.width || 6) - 3;

    const style = {
        border: !!borderColor && `2px solid ${borderColor}`,
        width,
        minWidth: width,
    };

    useReactTooltip();

    return (
        <div style={style} className={classNames('node', `node-id-${node.id}`, selected, block.className)}>
            <div className="header d-flex">
                {topLeft && (
                    <div>
                        <SocketHandle
                            type="input"
                            propKey={block.topLeft}
                            socket={topLeft.socket}
                            io={topLeft}
                            innerRef={bindSocket}
                        />
                    </div>
                )}
                <div
                    className="title d-inline-block flex-grow-1 d-flex text-nowrap overflow-hidden"
                    style={{color: block.category.data.color}}
                    data-tip={!block.computeTitle && learningMode && block.info ? getInfoText(block.info) : undefined}>
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
                            propKey={block.topRight}
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
                .filter(filterProp)
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
