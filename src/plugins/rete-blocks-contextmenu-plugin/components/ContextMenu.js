import React, {useContext, useState} from 'react';
import {MenuContext} from '../contexts/MenuContext';
import SelectionMenu from './menus/SelectionMenu';
import PlacementMenu from './menus/PlacementMenu';


export default function ContextMenu() {

    const {editor, context} = useContext(MenuContext);

    console.log(123);////

    return (
        <div className="context-menu">
            {editor.selected.list.length ? (
                <SelectionMenu/>
            ) : (
                <PlacementMenu/>
            )}
        </div>
    );
}