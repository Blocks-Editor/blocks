import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import getDefaultLabel from '../../../../../utils/getDefaultLabel';


const NodeItem = ({component, onCreateNode, style}) => {
    const handleClick = useCallback(() => {
        onCreateNode(component);
    }, [component, onCreateNode]);

    return (
        <div
            onClick={handleClick}
            style={style}>
            {component.block.title || getDefaultLabel(component.name)}
        </div>
    );
};

NodeItem.propTypes = {
    component: PropTypes.object.isRequired,
};

export default NodeItem;
