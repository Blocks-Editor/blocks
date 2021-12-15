import React, {useContext} from 'react';
import EventsContext, {PROJECT_LOAD_EVENT} from '../../contexts/EventsContext';
import styled from 'styled-components';
import classNames from 'classnames';
import {getExampleProjects} from '../../examples/examples';
import FileDropZone from '../common/FileDropZone';
import {DROP_ZONE_EXTENSIONS} from './Editor';
import LoadFileContext from '../../contexts/LoadFileContext';
import MenuModalOption from '../common/MenuModalOption';

const MenuContainer = styled.div`
    padding: 20px;
`;

const StyledFileDropZone = styled(FileDropZone)`
    padding: 2em;
    border: 2px #0005 dashed;

    &.dragging, &:hover {
        background: #0002;
    }
`;

export default function LoadProjectModal({className, ...others}) {

    const events = useContext(EventsContext);
    const loadFile = useContext(LoadFileContext);

    const examples = getExampleProjects();

    return (
        <MenuContainer className={classNames('bg-light', className)} {...others}>
            <StyledFileDropZone
                className={classNames('clickable text-center text-muted rounded-3')}
                options={{accept: DROP_ZONE_EXTENSIONS.join(',')}}
                onFileContent={loadFile}>
                <h5>Import a .blocks file . . .</h5>
            </StyledFileDropZone>
            {examples.map((example, i) => (
                <MenuModalOption
                    key={i}
                    name={example.name}
                    description={example.description || '(No description provided)'}
                    onClick={() => events.emit(PROJECT_LOAD_EVENT, example)}>
                </MenuModalOption>
            ))}
        </MenuContainer>
    );
}