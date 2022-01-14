import React from 'react';
import styled from 'styled-components';
import useControlValue from '../../../../hooks/useControlValue';
import {bindNodeInput} from '../../../../utils/bindNodeInput';
import {onAnyRelease} from '../../../../utils/eventHelpers';

const Container = styled.div`
    cursor: pointer;
    border: 2px solid ${({selected}) => selected ? '#fffa' : '#fff8'};
`;

const ResizeArea = styled.div`
    user-select: none;
    cursor: default;
    background: #fff1;
    resize: both;
    overflow: hidden;
`;

export default function RegionNodeView({block, nodeHandle}) {
    const {node} = nodeHandle.props;
    const {selected} = nodeHandle.state;

    const [width, setWidth] = useControlValue(node.controls.get('widthPixels'));
    const [height, setHeight] = useControlValue(node.controls.get('heightPixels'));

    const bindContainer = (element) => {
        if(!element) {
            return;
        }
        // Render behind other nodes
        element.parentElement.style.zIndex = String(-1);
    };

    return (
        <Container ref={bindContainer} className="p-2 rounded-3" selected={selected}>
            <ResizeArea
                ref={bindNodeInput}
                style={{width: width || 300, height: height || 100}}
                {...onAnyRelease(event => setWidth(event.target.clientWidth) & setHeight(event.target.clientHeight))}
            />
        </Container>
    );
}
