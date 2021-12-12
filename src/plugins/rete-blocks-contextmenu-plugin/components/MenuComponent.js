import React from 'react';
import MenuAction from './MenuAction';
import {FaRegStickyNote} from 'react-icons/fa';
import getBlockLabel from '../../../utils/getBlockLabel';
import useReactTooltip from '../../../hooks/useReactTooltip';
import useLearningModeState from '../../../hooks/persistent/useLearningModeState';


export default function MenuComponent({component, specialTitle, ...others}) {
    const block = component.block;
    const category = block?.category;
    const [learningMode] = useLearningModeState();

    useReactTooltip();
    if(block?.info) {
        let tooltip = block.info.endsWith('.') ? block.info : `${block.info}.`;
        if(learningMode && block.useCases?.length) {
            tooltip += `<br>Use cases: ${block.useCases.join(', ')}`;
        }
        others = {
            'data-tip': tooltip,
            'data-place': 'right',
            ...others,
        };
    }

    const title = getBlockLabel(block) || component.name;

    return (
        <MenuAction
            icon={React.createElement(block?.icon || category?.data.icon || FaRegStickyNote)}
            color={category?.data.color}
            className={`component-${component.name}`}
            {...others}>
            {specialTitle !== undefined ? <>{specialTitle} <span style={{opacity: .5}}>({title})</span></> : title}
        </MenuAction>
    );
}