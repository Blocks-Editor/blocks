import React from 'react';
import styled from 'styled-components';
import useControlValue from '../../../../hooks/utils/useControlValue';
import {bindNodeInput} from '../../../../utils/bindNodeInput';

const Container = styled.div`
  cursor: pointer;
    // background: ${({selected}) => selected ? '#fff8' : '#fff3'};
  border: 2px solid ${({selected}) => selected ? '#fffa' : '#fff8'};
`;

const ResizeArea = styled.div`
  pointer-events: none;
  //cursor: default;
  background: #fff1;
  resize: both;
  overflow: hidden;
`;

export default function RegionNodeView({block, nodeHandle}) {
    const {/*editor,*/ node/*, bindControl*/} = nodeHandle.props;
    const {selected} = nodeHandle.state;

    const [width, setWidth] = useControlValue(node.controls.get('widthPixels'));
    const [height, setHeight] = useControlValue(node.controls.get('heightPixels'));

    const bindContainer = (el) => {
        if(!el) {
            return;
        }
        // Render behind other nodes
        el.parentElement.style.zIndex = '-1';
    };

    return (
        <Container ref={bindContainer} className="p-2 rounded-3" selected={selected}>
            <ResizeArea
                ref={bindNodeInput}
                style={{width: width || 300, height: height || 100}}
                onMouseUp={event => setWidth(event.target.clientWidth) & setHeight(event.target.clientHeight)}
            />
        </Container>
    );
}
