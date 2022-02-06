import React, {useState} from 'react';
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

const StyledExpandable = styled(Expandable)`
    //background: #222;
    background: var(--bs-dark);
    color: #FFF;
    padding: .75rem;
    margin-bottom: .5rem;
    border-radius: .75rem;
`;

function Expandable({header, className, children, ...others}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className={classNames('clickable', className)}
            {...onLeftClick(() => setExpanded(!expanded))}
            {...others}>
            {header}
            {expanded && children}
        </div>
    );
}

function BlockEntry({block}) {

    const Icon = block.icon;

    return (
        <StyledExpandable
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
            }>
            <div className="mt-2">
                Use cases:
                {block.useCases?.length > 0 && block.useCases?.map((useCase, i) => (
                    <span key={useCase} className="text-secondary">
                        <div className="text-info mx-2">{capitalize(useCase)}</div>
                    </span>
                ))}
            </div>
        </StyledExpandable>
    );
}

function TypeEntry({type}) {

    const color = getTypeColor(type);

    return (
        <StyledExpandable
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
            }>
            {/*<div className="mt-2">*/}

            {/*</div>*/}
        </StyledExpandable>
    );
}

export default function ReferenceModal() {

    const editor = useNodeEditor();

    const editorNodeNameSet = new Set([...editor.nodes.values()].map(node => node.name));

    const types = [...TYPE_MAP.values()]
        .filter(type => !type.data.abstract)
        .sort((a, b) => a.name.localeCompare(b.name));

    const blocks = [...BLOCK_MAP.values()]
        .filter(block => !block.hidden)
        .map(block => [block, getBlockLabel(block)])
        .sort(([aBlock, aLabel], [bBlock, bLabel]) =>
            (+editorNodeNameSet.has(bBlock.name) - editorNodeNameSet.has(aBlock.name)) ||
            (aBlock.category.name.localeCompare(bBlock.category.name)) ||
            aLabel.localeCompare(bLabel),
        )
        .map(([block]) => block);

    return (
        <MenuModal title="Quick Reference:">
            <div>
                <h4 className="mt-4 mb-3 fw-normal">All Blocks</h4>
                <ScrollContainer>
                    {blocks/*.filter(block => editorNodeNameSet.has(block.name))*/.map((block) => (
                        <BlockEntry key={block.name} block={block}/>
                    ))}
                </ScrollContainer>
            </div>
            <div>
                <h4 className="mt-4 mb-3 fw-normal">Socket Types</h4>
                <ScrollContainer>
                    {types.map((type) => (
                        <TypeEntry key={type.name} type={type}/>
                    ))}
                </ScrollContainer>
            </div>
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
                <h4 className="mt-4 mb-3 fw-normal">Keyboard Shortcuts</h4>
                <KeyBindingDetail/>
            </div>
        </MenuModal>
    );
}