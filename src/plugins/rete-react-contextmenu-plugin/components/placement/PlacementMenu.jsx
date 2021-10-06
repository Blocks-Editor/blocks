import React from 'react';
import MenuPositioner from '../MenuPositioner';
import useComponents from '../../utils/useComponents';
import NodeItem from '../node/NodeItem';

// TODO: migrate to SCSS?

let style = {
    background: '#FFF',
};

let itemStyle = {
    padding: '5px',
    cursor: 'pointer',
    color: '#222',
};

const PlacementMenu = ({x, y, root, editor, onCreateNode, context}) => {
    const components = useComponents(editor, context);

    return (
        <MenuPositioner
            x={x}
            y={y}
            style={style}
            root={root}
            editor={editor}>
            {components.map((component) => (
                <NodeItem
                    onCreateNode={onCreateNode}
                    key={component.name}
                    component={component}
                    style={itemStyle}
                />
            ))}
        </MenuPositioner>
    );
};

PlacementMenu.propTypes = {};

export default PlacementMenu;
