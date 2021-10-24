import React from 'react';
import MenuAction from './MenuAction';
import {FaRegStickyNote} from 'react-icons/all';


export default function MenuNode({component, ...others}) {
    let category = component.block?.category;
    return (
        <MenuAction {...others} icon={React.createElement(category?.data.icon || FaRegStickyNote)}
            color={category?.data.color}>
            {component.block?.title || component.name}
        </MenuAction>
    );
}