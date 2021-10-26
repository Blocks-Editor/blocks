import React from 'react';
import MenuAction from './MenuAction';
import {FaRegStickyNote} from 'react-icons/all';
import getBlockLabel from '../../../utils/getBlockLabel';


export default function MenuNode({component, ...others}) {
    let category = component.block?.category;
    return (
        <MenuAction {...others} icon={React.createElement(component.block?.icon || category?.data.icon || FaRegStickyNote)}
            color={category?.data.color}>
            {getBlockLabel(component.block)||component.name}
        </MenuAction>
    );
}