import React, {useContext} from 'react';
import MenuAction from '../MenuAction';
import {MenuContext} from '../../contexts/MenuContext';


export default function SelectionMenu() {

    const {editor} = useContext(MenuContext);

    return (
        <>
            <MenuAction onAction={() => editor.selected.each(node => editor.removeNode(node))}>Delete</MenuAction>
            {/*<MenuOption>Clone</MenuOption>*/}
        </>
    );
}