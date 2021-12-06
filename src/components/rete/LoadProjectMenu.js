import React, {useContext} from 'react';
import EventsContext, {PROJECT_LOAD_EVENT} from '../../contexts/EventsContext';
import styled from 'styled-components';
import classNames from 'classnames';
import {getExampleProjects} from '../../examples/examples';
import FileDropZone from '../common/FileDropZone';
import {DROP_ZONE_EXTENSIONS} from './Editor';

const MenuContainer = styled.div`
    padding: 20px;
`;

const LoadProjectItemContainer = styled.div`
    :hover {
        background: #0001;
    }
`;

const StyledFileDropZone = styled(FileDropZone)`
    padding: 2em;
    border: 2px #0005 dashed;

    &.dragging, &:hover {
        background: #0002;
    }
`;

export default function LoadProjectMenu({onLoadFileContent, className, ...others}) {

    const events = useContext(EventsContext);

    const examples = getExampleProjects();

    return (
        <MenuContainer className={classNames('bg-light', className)} {...others}>
            <StyledFileDropZone
                className={classNames('clickable text-center text-muted rounded-3')}
                options={{accept: DROP_ZONE_EXTENSIONS.join(',')}}
                onFileContent={onLoadFileContent}>
                <h5>Import a .blocks file . . .</h5>
            </StyledFileDropZone>
            {examples.map((example, i) => (
                <LoadProjectItemContainer
                    key={i}
                    className="clickable mt-2 px-3 py-2"
                    onClick={() => events.emit(PROJECT_LOAD_EVENT, example)}>
                    <h4 className="fw-normal">{example.name}</h4>
                    <div className="text-muted">{example.description || '(No description provided)'}</div>
                </LoadProjectItemContainer>
            ))}
        </MenuContainer>
    );
}