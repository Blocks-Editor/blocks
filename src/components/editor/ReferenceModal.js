import React, {useContext, useState} from 'react';
import MenuModal from '../common/MenuModal';
import KeyBindingDetail from './KeyBindingDetail';
import styled from 'styled-components';
import {BLOCK_MAP, getBlock} from '../../editor/blocks';
import getBlockLabel from '../../utils/getBlockLabel';
import getInfoText from '../../utils/getInfoText';
import {TYPE_MAP} from '../../block-types/types';
import useNodeEditor from '../../hooks/useNodeEditor';
import {getTypeColor} from '../../block-types/type-colors';
import {onLeftClick} from '../../utils/eventHelpers';
import classNames from 'classnames';
import capitalize from '../../utils/capitalize';
import {CATEGORY_MAP} from '../../block-categories/categories';
import {getExampleUsages} from '../../examples/examples';
import getPropLabel from '../../utils/getPropLabel';
import {USE_CASES} from '../../editor/useCases';

const ScrollContainer = styled.div`
    padding: .5rem 1rem;
    background: #0001;
    max-height: 20rem;
    overflow-y: auto;
    border-radius: 0.25rem;
`;

const StyledEntry = styled(Entry)`
    //background: rgb(2, 31, 47);
    background: #00131C;
    color: #FFF;
    padding: .75rem;
    margin-bottom: .5rem;
    border-radius: .75rem;
`;

const MultiSelectionContext = React.createContext(null);

function Entry({target, subTargets, header, noExpand, className, children, ...others}) {
    // const [scrollOffset,setScrollOffset]=useState(null)

    // const [expanded, setExpanded] = useState(false);

    const {selected, setSelected} = useContext(MultiSelectionContext);

    const isSelected = selected.includes(target);

    let element;
    const ref = el => element = el;

    return (
        <div
            ref={ref}
            className={classNames('clickable my-1', className, selected.length && !isSelected && 'opacity-50')}
            {...onLeftClick(e => {
                e.stopPropagation();
                setSelected(isSelected ? [] : [target, ...subTargets || []]);
                const offsetTop = element?.offsetTop ?? null;
                setTimeout(() => {
                    if(element && offsetTop !== null) {
                        // element.parentElement.
                        element.parent.scrollTop = offsetTop;
                        // console.log(offsetTop, element);
                    }
                });
            })}
            {...others}>
            {header}
            {!noExpand && isSelected && children}
        </div>
    );
}

function CategoryEntry({category, blocks, ...others}) {

    blocks = blocks.filter(block => block.category === category);

    if(!blocks.length) {
        return null;
    }

    const Icon = category.data.icon;

    return (
        <StyledEntry
            target={category}
            header={
                <div>
                    <div className="h6 mb-0 d-flex align-items-center" style={{color: category.data.color}}>
                        {!!Icon && <Icon className="me-2"/>}
                        {category.name}
                    </div>
                    <div className="small text-secondary">
                        {getInfoText(category.data.info)}
                    </div>
                </div>
            }
            {...others}>
            <MultiSelectionContainer>
                {blocks.map(block => (
                    <div key={block.name}>
                        <BlockEntry block={block} style={{background: '#0004'}}/* noExpand*//>
                    </div>
                ))}
            </MultiSelectionContainer>
        </StyledEntry>
    );
}

function BlockEntry({block, ...others}) {

    const Icon = block.icon;

    const usages = getExampleUsages(block.name);

    const isPropVisible = prop => !prop.hidden && prop.type;

    const inputs = block.inputs.filter(isPropVisible);
    const outputs = block.outputs.filter(isPropVisible);

    return (
        <StyledEntry
            target={block}
            subTargets={[
                block.category,
                ...inputs.map(prop => prop.type),
                ...outputs.map(prop => prop.type),
                ...block.useCases || [],
            ]}
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
            <div className="mt-2">
                <span className="opacity-50">Category:</span>
                <div className="d-flex align-items-center" style={{color: block.category.data.color || '#FFF'}}>
                    {!!block.category.data.icon && React.createElement(block.category.data.icon, {className: 'mx-2'})}
                    {block.category.name}
                </div>
            </div>
            {block.useCases?.length > 0 && (
                <div className="mt-2">
                    <span className="opacity-50">Use cases:</span>
                    {block.useCases?.map(useCase => (
                        <ul key={useCase} className="mb-0">
                            <li>{capitalize(useCase)}</li>
                        </ul>
                    ))}
                </div>
            )}
            {usages?.length > 0 && (
                <div className="mt-2">
                    <span className="opacity-50">Found in example projects:</span>
                    <ul className="mb-0 text-muted">
                        {usages.map(({example, count}, i) => (
                            <li key={i}>
                                {example.name}
                                {count !== 1 && <span className="text-secondary ms-2">(x{count})</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {[[inputs, 'Inputs'], [outputs, 'Outputs']].map(([props, label]) => (
                props.length > 0 && (
                    <div key={label} className="mt-2">
                        <span className="opacity-50">{label}:</span>
                        <ul className="mb-0 text-secondary">
                            {props.map(prop => (
                                <li key={prop.key}>
                                    <div className="d-flex align-items-center">
                                        <span className="flex-grow-1">{getPropLabel(prop)}</span>
                                        <small><SocketLabel type={prop.type}/* input={prop.input} output={prop.output}*//></small>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            ))}
        </StyledEntry>
    );
}

function TypeEntry({type, blocks, ...others}) {

    blocks = blocks.filter(block => Object.values(block.props).some(prop => !prop.hidden && prop.type && prop.type.data.baseType === type));

    return (
        <StyledEntry
            target={type}
            header={
                <div>
                    <div className="h6 mb-0">
                        <SocketLabel type={type} input={true}/>
                    </div>
                    <div className="small text-secondary">
                        {getInfoText(type.data.info)}
                    </div>
                </div>
            }
            {...others}>
            {blocks.length > 0 && (
                <div className="mt-2">
                    <span className="opacity-50">Relevant blocks:</span>
                    <MultiSelectionContainer>
                        {blocks.map(block => (
                            <div key={block.name}>
                                <BlockEntry block={block} style={{background: '#0004'}}/* noExpand*//>
                            </div>
                        ))}
                    </MultiSelectionContainer>
                </div>
            )}
        </StyledEntry>
    );
}

function UseCaseEntry({useCase, blocks, ...others}) {

    blocks = blocks.filter(block => block.useCases?.includes(useCase));

    return (
        <StyledEntry
            target={useCase}
            header={
                <div>
                    <div className="h6 mb-0" style={{opacity: .9}}>
                        {capitalize(useCase)}
                    </div>
                    {/*<div className="small text-secondary">*/}
                    {/*    {getInfoText(type.data.info)}*/}
                    {/*</div>*/}
                </div>
            }
            {...others}>
            {blocks.length > 0 && (
                <div className="mt-2">
                    {/*<span className="opacity-50">Relevant blocks:</span>*/}
                    <MultiSelectionContainer>
                        {blocks.map(block => (
                            <div key={block.name}>
                                <BlockEntry block={block} style={{background: '#0004'}}/* noExpand*//>
                            </div>
                        ))}
                    </MultiSelectionContainer>
                </div>
            )}
        </StyledEntry>
    );
}

function SocketLabel({type, input, output}) {
    const color = getTypeColor(type);

    const getSocketCircle = (left) => (
        <div
            style={{
                width: '1rem',
                height: '1rem',
                borderRadius: '50%',
                [left ? 'marginRight' : 'marginLeft']: '.5rem',
                background: color,
            }}>
        </div>
    );

    return (
        <span className="d-flex align-items-center" style={{color}}>
            {!!input && getSocketCircle(true)}
            {type === type.data.baseType ? type.name : type.toTypeString()}
            {!!output && getSocketCircle(false)}
        </span>
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
    const editorBlockNameSet = new Set([...editor.nodes.values()].map(node => node.name));

    const initialBlocks = selectionNameSet.size ? [...selectionNameSet].map(name => getBlock(name)) : [];
    const initialCategories = [...new Set(initialBlocks.map(block => block.category))];

    const initial = [
        ...initialBlocks,
        ...initialCategories,
    ];

    const [selected, setSelected] = useState(initial);

    const categories = [...CATEGORY_MAP.values()]
        .sort((a, b) =>
            +selected.includes(b) - selected.includes(a) ||
            a.name.localeCompare(b.name),
        );

    const blocks = [...BLOCK_MAP.values()]
        .filter(block => !block.hidden/* || selected.includes(block)*/ || initialBlocks.includes(block))
        .map(block => [block, getBlockLabel(block)])
        .sort(([aBlock, aLabel], [bBlock, bLabel]) =>
            +selected.includes(bBlock) - selected.includes(aBlock) ||
            +editorBlockNameSet.has(bBlock.name) - editorBlockNameSet.has(aBlock.name) ||
            aBlock.category.name.localeCompare(bBlock.category.name) ||
            aLabel.localeCompare(bLabel),
        )
        .map(([block]) => block);

    const types = [...TYPE_MAP.values()]
        .filter(type => (!type.data.abstract && !type.data.hidden) || selected.includes(type))
        .sort((a, b) =>
            +selected.includes(b) - selected.includes(a) ||
            a.name.localeCompare(b.name),
        );

    const useCases = USE_CASES
        .sort((a, b) =>
            +selected.includes(b) - selected.includes(a),
        );

    return (
        <MenuModal title="Quick Reference:">
            <MultiSelectionContext.Provider value={{selected, setSelected}}>

                {/* Blocks */}
                <h4 className="mt-4 mb-3 fw-normal text-secondary">All Blocks</h4>
                <ScrollContainer>
                    {blocks.map((block) => (
                        <BlockEntry key={block.name} block={block}/>
                    ))}
                </ScrollContainer>

                {/* Categories */}
                <h4 className="mt-4 mb-3 fw-normal text-secondary">Categories</h4>
                <ScrollContainer>
                    {categories.map((category) => (
                        <CategoryEntry key={category.name} category={category} blocks={blocks}/>
                    ))}
                </ScrollContainer>

                {/* Sockets */}
                <h4 className="mt-4 mb-3 fw-normal text-secondary">Socket Types</h4>
                <ScrollContainer>
                    {types.map((type) => (
                        <TypeEntry key={type.name} type={type} blocks={blocks}/>
                    ))}
                </ScrollContainer>

                {/* Use Cases */}
                <h4 className="mt-4 mb-3 fw-normal text-secondary">Use Cases</h4>
                <ScrollContainer>
                    {useCases.map((useCase) => (
                        <UseCaseEntry key={useCase} useCase={useCase} blocks={blocks}/>
                    ))}
                </ScrollContainer>

            </MultiSelectionContext.Provider>
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
            <div className="text-secondary">
                <h4 className="mt-4 mb-3 fw-normal text-secondary">Keyboard Shortcuts</h4>
                <KeyBindingDetail/>
            </div>
        </MenuModal>
    );
}