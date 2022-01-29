import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';
import {bindNodeInput} from '../../../../utils/bindNodeInput';
import useControlValue from '../../../../hooks/useControlValue';
import {onAnyRelease} from '../../../../utils/eventHelpers';

const Container = styled.div`
    cursor: pointer;
    color: black;
    background: ${({selected}) => selected ? '#FFFA' : '#FFF8'};
`;

const StyledTextArea = styled(TextareaAutosize)`
    font-weight: 500;
    resize: horizontal;
    background: #FFF8;
`;

export default function CommentNodeView({block, nodeHandle}) {
    const {/*editor,*/ node/*, bindControl*/} = nodeHandle.props;
    const {selected} = nodeHandle.state;

    let textArea;

    const [text, setText] = useControlValue(node.controls.get('text'));
    const [width, setWidth] = useControlValue(node.controls.get('widthPixels'));

    const bindContainer = (element) => {
        if(element) {
            // Render in front of other nodes
            element.parentElement.style.zIndex = String(1);
        }
    };

    return (
        <Container
            ref={bindContainer}
            className="pt-2 ps-2 pe-4 rounded-3"
            selected={selected}
            {...onAnyRelease(() => textArea && setWidth(textArea.offsetWidth))}>
            <StyledTextArea
                style={{width: width || 300}}
                rows={1}
                maxRows={100}
                ref={el => bindNodeInput(el) & (textArea = el)}
                value={text || ''}
                placeholder="Comment"
                onChange={e => setText(e.target.value)}
            />
        </Container>
    );
}
