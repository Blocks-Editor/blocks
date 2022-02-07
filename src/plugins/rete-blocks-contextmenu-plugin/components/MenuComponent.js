import React from 'react';
import MenuAction from './MenuAction';
import {FaRegStickyNote} from 'react-icons/fa';
import getBlockLabel from '../../../utils/getBlockLabel';
import useReactTooltip from '../../../hooks/useReactTooltip';
import useLearningModeState from '../../../hooks/persistent/useLearningModeState';
import getInfoText from '../../../utils/getInfoText';
import classNames from 'classnames';
import {camelCase} from 'change-case';


export default function MenuComponent({component, specialTitle, ...others}) {
    const block = component.block;
    const category = block?.category;
    const [learningMode] = useLearningModeState();

    if(block?.info) {
        let tooltip = getInfoText(block.info);
        if(learningMode && block.useCases?.length) {
            tooltip += `<br>Use cases: ${block.useCases.join(', ')}`;
        }
        others = {
            'data-tip': tooltip,
            'data-place': 'right',
            ...others,
        };
    }

    if(specialTitle !== null && specialTitle !== undefined) {
        specialTitle = String(specialTitle);
    }

    useReactTooltip();

    const title = getBlockLabel(block) || component.name;

    return (
        <MenuAction
            icon={React.createElement(block?.icon || category?.data.icon || FaRegStickyNote)}
            color={category?.data.color}
            className={classNames(`component-${component.name}`, specialTitle && `custom-title custom-title-${camelCase(specialTitle)}`)}
            {...others}>
            {specialTitle !== undefined ? <>{specialTitle} <span style={{opacity: .5}}>({title})</span></> : title}
        </MenuAction>
    );
}