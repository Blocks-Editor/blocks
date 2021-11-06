import React from 'react';
import MenuItem from './MenuItem';
import styled from 'styled-components';

let MenuItemStyled = styled(MenuItem)`
  cursor: pointer;
  border-radius: 10px;

  :hover  {
    background: #F0F0F0;
    & > svg {
      fill: url("#blocks-icon-gradient")
    }
  }
`;

const hiddenSVGStyle = {
    width: 0,
    height: 0,
    position: "absolute"
}

export default function MenuButton({children, ...others}) {
    return (
        <MenuItemStyled {...others}>
            <svg style={hiddenSVGStyle} aria-hidden="true" focusable="false">
                <linearGradient id="blocks-icon-gradient" x2="1" y2="1">
                    <stop offset="0%" stopColor="#00EFFB" />
                    <stop offset="50%" stopColor="#8649E1" />
                    <stop offset="100%" stopColor="#F900E3" />
                </linearGradient>
            </svg>
            {children}
        </MenuItemStyled>
    );
}