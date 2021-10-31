import React, {useContext} from 'react';
import EventsContext, {PROJECT_LOAD_EVENT} from '../../contexts/EventsContext';
import styled from 'styled-components';
import classNames from 'classnames';
import {getExampleProjects} from '../../examples/examples';

const MenuContainer = styled.div`
  padding: 20px;
`;

const LoadProjectItemContainer = styled.div`

`;

export default function LoadProjectMenu({className, ...others}) {

    const events = useContext(EventsContext);

    const examples = getExampleProjects();

    return (
        <MenuContainer className={classNames('bg-light', className)} {...others}>
            {examples.map((example, i) => (
                <LoadProjectItemContainer key={i} onClick={() => events.emit(PROJECT_LOAD_EVENT, example)}>
                    <h3>{example.name}</h3>
                </LoadProjectItemContainer>
            ))}
        </MenuContainer>
    );
}