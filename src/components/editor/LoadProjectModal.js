import React, {useContext} from 'react';
import EventsContext, {PROJECT_LOAD_EVENT} from '../../contexts/EventsContext';
import styled from 'styled-components';
import classNames from 'classnames';
import {getExampleCategories} from '../../examples/examples';
import FileDropZone from '../common/FileDropZone';
import {DROP_ZONE_EXTENSIONS} from './Editor';
import LoadFileContext from '../../contexts/LoadFileContext';
import MenuModalOption from '../common/MenuModalOption';
import {onLeftClick} from '../../utils/eventHelpers';
import MenuModal from '../common/MenuModal';
import {isMobile} from 'react-device-detect';


const StyledFileDropZone = styled(FileDropZone)`
    padding: 2rem 0;
    border: 2px #0005 dashed;

    &.dragging, &:hover {
        background: #0002;
    }
`;

const CategoryContainer = styled.div`
    margin-top: 2.5rem;
    //padding: .5rem;
    //border: 6px solid transparent;
    //border-left-color: var(--bs-secondary);
`;

const ExampleContainer = styled.div`
    border-left: 4px solid #0001;
`;

export default function LoadProjectModal({className, ...others}) {

    const events = useContext(EventsContext);
    const loadFile = useContext(LoadFileContext);

    const categories = getExampleCategories();

    // const examples = getExampleProjects();

    return (
        <MenuModal title={isMobile && 'Load an example:'} className={classNames(className)} {...others}>
            {!isMobile && (
                <StyledFileDropZone
                    className={classNames('clickable text-center text-secondary rounded-3')}
                    options={{accept: DROP_ZONE_EXTENSIONS.join(',')}}
                    onFileContent={loadFile}>
                    <h5>Import a .blocks file . . .</h5>
                </StyledFileDropZone>
            )}
            {categories.map((category, i) => (
                <div key={category.id}>
                    <CategoryContainer>
                        <h4 className="fw-bold text-secondary text-uppercase opacity-50">{category.name}</h4>
                        <h6 className="mb-3 text-secondary">{category.description}</h6>
                    </CategoryContainer>
                    {/*<hr/>*/}
                    <ExampleContainer className={category.className}>
                        {category.examples.map((example, i) => (
                            <MenuModalOption
                                key={i}
                                name={example.name}
                                description={example.description || '(No description provided)'}
                                {...onLeftClick(() => events.emit(PROJECT_LOAD_EVENT, example))}>
                            </MenuModalOption>
                        ))}
                    </ExampleContainer>
                </div>
            ))}
        </MenuModal>
    );
}