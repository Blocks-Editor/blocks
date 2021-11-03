import React from 'react';
import MenuAction from './MenuAction';
import {FaRegStickyNote} from 'react-icons/fa';
import getBlockLabel from '../../../utils/getBlockLabel';
import useReactTooltip from '../../../hooks/useReactTooltip';


export default function MenuComponent({component, ...others}) {
    const block = component.block;
    const category = block?.category;

    useReactTooltip();
    if(block?.info) {
        others = {'data-tip': block.info, 'data-place': 'right', ...others};
    }

    return (
        <MenuAction
            icon={React.createElement(block?.icon || category?.data.icon || FaRegStickyNote)}
            color={category?.data.color}
            {...others}>
            {getBlockLabel(block) || component.name}
        </MenuAction>
    );
}