import TopMenu from '../common/menus/TopMenu';
import MenuButton from '../common/menus/MenuButton';
import {FaFolder, FaSave} from 'react-icons/fa';
import React from 'react';
import MenuItem from '../common/menus/MenuItem';
import useReactTooltip from '../../hooks/useReactTooltip';

// TODO: react-icons -> styled-icons ///

export default function EditorMenu({editor}) {

    useReactTooltip();

    return (
        <TopMenu>
            <MenuItem>
                <span>Blocks.</span>
            </MenuItem>
            {/*<MenuButton onClick={() => 'TODO: new'} data-tip="New Project"><FaFile/></MenuButton>*/}
            <MenuButton onClick={() => 'TODO: save'} data-tip="Save Changes" data-delay-show={300}>
                <FaSave/>
            </MenuButton>
            <MenuButton onClick={() => 'TODO: load'} data-tip="Load Project" data-delay-show={300}>
                <FaFolder/>
            </MenuButton>
        </TopMenu>
    );
}