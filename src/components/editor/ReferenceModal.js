import React, {useContext, useState} from 'react';
import MenuModal from '../common/MenuModal';
import KeyBindingDetail from './KeyBindingDetail';
import styled from 'styled-components';
import {BLOCK_MAP} from '../../editor/blocks';
import getBlockLabel from '../../utils/getBlockLabel';
import getInfoText from '../../utils/getInfoText';
import {TYPE_MAP} from '../../block-types/types';
import useNodeEditor from '../../hooks/useNodeEditor';
import {getTypeColor} from '../../block-types/type-colors';
import {onLeftClick} from '../../utils/eventHelpers';
import classNames from 'classnames';
import capitalize from '../../utils/capitalize';

const ScrollContainer = styled.div`
    padding: .5rem 1rem;
    background: #0001;
    max-height: 20rem;
    overflow-y: auto;
    border-radius: 0.25rem;
`;

const StyledEntry = styled(Entry)`
    //background: #222;
    background: var(--bs-dark);
    color: #FFF;
    padding: .75rem;
    margin-bottom: .5rem;
    border-radius: .75rem;
`;

const MultiSelectionContext = React.createContext(null);

function Entry({target, header, className, children, ...others}) {
    // const [expanded, setExpanded] = useState(false);

    const {selected, setSelected} = useContext(MultiSelectionContext);

    const isSelected = selected.includes(target);

    return (
        <div
            className={classNames('clickable', className, selected.length && !isSelected && 'opacity-50')}
            {...onLeftClick(() => setSelected(isSelected ? [] : [target]))}
            {...others}>
            {header}
            {isSelected && children}
        </div>
    );
}

function BlockEntry({block, ...others}) {

    const Icon = block.icon;

    return (
        <StyledEntry
            target={block}
            header={
                <div>
                    <div className="h6 mb-0 d-flex align-items-center" style={{color: block.category.data.color}}>
                        {!!Icon && <Icon className="me-2"/>}
                        {getBlockLabel(block)}
                    </div>
                    <div className="small text-secondary">
                        {getInfoText(block.info)}
                    </div>
                </div>
            }
            {...others}>
            {block.useCases?.length > 0 && (
                <div className="mt-2">
                    Use cases:
                    {block.useCases?.map(useCase => (
                        <ul key={useCase} className="mb-0 text-muted">
                            <li>{capitalize(useCase)}</li>
                        </ul>
                    ))}
                </div>
            )}
        </StyledEntry>
    );
}

function TypeEntry({type, ...others}) {

    const color = getTypeColor(type);

    return (
        <StyledEntry
            target={type}
            header={
                <div>
                    <div className="h6 mb-0 d-flex align-items-center" style={{color}}>
                        {/*<FiCircle className="me-2"/>*/}
                        <div
                            style={{
                                width: '1rem',
                                height: '1rem',
                                borderRadius: '50%',
                                marginRight: '.5rem',
                                background: color,
                            }}>

                        </div>
                        {type.name}
                    </div>
                    <div className="small text-secondary">
                        {getInfoText(type.data.info)}
                    </div>
                </div>
            }
            {...others}>
            {/*<div className="mt-2">*/}

            {/*</div>*/}
        </StyledEntry>
    );
}

function MultiSelectionContainer({children, initial}) {
    const [selected, setSelected] = useState(initial || []);

    return (
        <MultiSelectionContext.Provider value={{selected, setSelected}}>
            {children}
        </MultiSelectionContext.Provider>
    );
}

export default function ReferenceModal() {

    const editor = useNodeEditor();

    const selectionNameSet = new Set(editor.selected.list.map(node => node.name));
    const nodeNameSet = new Set([...editor.nodes.values()].map(node => node.name));

    const types = [...TYPE_MAP.values()]
        .filter(type => !type.data.abstract)
        .sort((a, b) => a.name.localeCompare(b.name));

    const blocks = [...BLOCK_MAP.values()]
        .filter(block => !block.hidden)
        .map(block => [block, getBlockLabel(block)])
        .sort(([aBlock, aLabel], [bBlock, bLabel]) =>
            (+selectionNameSet.has(bBlock.name) - selectionNameSet.has(aBlock.name)) ||
            (+nodeNameSet.has(bBlock.name) - nodeNameSet.has(aBlock.name)) ||
            (aBlock.category.name.localeCompare(bBlock.category.name)) ||
            aLabel.localeCompare(bLabel),
        )
        .map(([block]) => block);

    return (
        <MenuModal title="Quick Reference:">
            <MultiSelectionContainer initial={selectionNameSet.size && [...selectionNameSet].map(name => BLOCK_MAP.get(name))}>
                <h4 className="mt-4 mb-3 fw-normal text-secondary">All Blocks</h4>
                <ScrollContainer>
                    {blocks/*.filter(block => editorNodeNameSet.has(block.name))*/.map((block) => (
                        <BlockEntry key={block.name} block={block}/>
                    ))}
                </ScrollContainer>
            </MultiSelectionContainer>
            <MultiSelectionContainer>
                <h4 className="mt-4 mb-3 fw-normal text-secondary">Socket Types</h4>
                <ScrollContainer>
                    {types.map((type) => (
                        <TypeEntry key={type.name} type={type}/>
                    ))}
                </ScrollContainer>
            </MultiSelectionContainer>
            {/*<div>*/}
            {/*    <h4 className="mt-4 mb-3 fw-normal">Use Cases</h4>*/}
            {/*    {USE_CASES.map(useCase => (*/}
            {/*        <ScrollContainer key={useCase}>*/}
            {/*            {blocks.filter(block => block.useCases?.includes(useCase)).map((block) => (*/}
            {/*                <BlockEntry key={block.name} block={block}/>*/}
            {/*            ))}*/}
            {/*        </ScrollContainer>*/}
            {/*    ))}*/}
            {/*</div>*/}
            <div>
                <h4 className="mt-4 mb-3 fw-normal text-secondary">Keyboard Shortcuts</h4>
                <KeyBindingDetail/>
            </div>
        </MenuModal>
    );
}