import React from 'react';
import MenuItem from './MenuItem';
import styled from 'styled-components';

let MenuItemStyled = styled(MenuItem)`
  cursor: pointer;

  :hover {
    background: #0002;
  }
`;

export default function MenuButton({children, ...others}) {
    return (
        <MenuItemStyled {...others}>
            {children}
        </MenuItemStyled>
    );
}