import React, {useContext} from 'react';
import EventsContext, {ERROR_EVENT, PROJECT_LOAD_EVENT} from '../../contexts/EventsContext';
import styled from 'styled-components';
import classNames from 'classnames';
import {getExampleProjects} from '../../examples/examples';
import FileDropZone from '../common/FileDropZone';

const MenuContainer = styled.div`
  padding: 20px;
`;

const LoadProjectItemContainer = styled.div`
  :hover {
    background: #0001;
  }
`;

export default function LoadProjectMenu({className, ...others}) {

    const events = useContext(EventsContext);

    const examples = getExampleProjects();

    const loadFileContent = content => {
        try {
            let project = JSON.parse(content);
            events.emit(PROJECT_LOAD_EVENT, project);
        }
        catch(err) {
            events.emit(ERROR_EVENT, err);
        }
    };

    return (
        <MenuContainer className={classNames('bg-light', className)} {...others}>
            <FileDropZone onFileContent={loadFileContent}/>
            {examples.map((example, i) => (
                <LoadProjectItemContainer
                    key={i}
                    className="clickable mt-2 px-3 py-2"
                    onClick={() => events.emit(PROJECT_LOAD_EVENT, example)}>
                    <h4>{example.name}</h4>
                    <div className="text-muted">{example.description || '(No description provided)'}</div>
                </LoadProjectItemContainer>
            ))}
        </MenuContainer>
    );
}