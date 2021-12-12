import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';
import {bindNodeInput} from '../../../../utils/bindNodeInput';
import useControlValue from '../../../../hooks/utils/useControlValue';

const Container = styled.div`
  cursor: pointer;
  color: black;
  background: ${({selected}) => selected ? '#fffa' : '#fff8'};
`;

const StyledTextArea = styled(TextareaAutosize)`
  font-weight: 500;
  resize: horizontal;
  background: #fff8;
`;

export default function CommentNodeView({block, nodeHandle}) {
    const {/*editor,*/ node/*, bindControl*/} = nodeHandle.props;
    const {selected} = nodeHandle.state;

    const [text, setText] = useControlValue(node.controls.get('text'));
    const [width, setWidth] = useControlValue(node.controls.get('widthPixels'));

    return (
        <Container className="pt-2 ps-2 pe-4 rounded-3" selected={selected}>
            {/*<div className="">Comment</div>*/}
            <StyledTextArea
                style={{width: width || 200}}
                rows={1}
                maxRows={100}
                ref={bindNodeInput}
                value={text || ''}
                placeholder="Comment"
                onChange={e => setText(e.target.value)}
                onMouseUp={e => setWidth(e.target.clientWidth)}
            />
        </Container>
    );
}
