import React from 'react';
import MenuItem from './MenuItem';
import styled from 'styled-components';
import {paramCase} from 'change-case';

let MenuItemStyled = styled(MenuItem)`
  cursor: pointer;
  border-radius: 10px;

  :hover {
    background: #F0F0F0;
  }
  
  :hover > svg {
    fill: url("#svg-block-gradient");
  }
`;

const IconStyled = styled.svg`
  position: absolute;
  width: 0;
  height: 0;
`;

export default function MenuButton({children, ...others}) {
    const {tooltip} = others;

    // Ensure valid tooltip for unique gradient `id` attribute
    if(!tooltip) {
        console.warn('Missing tooltip on MenuButton');
        return null;
    }

    return (
        <MenuItemStyled {...others}>
            <IconStyled aria-hidden="true" focusable="false">
            </IconStyled>
            {children}
        </MenuItemStyled>
    );
}