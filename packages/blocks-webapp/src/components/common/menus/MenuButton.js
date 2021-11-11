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
`;

const IconStyled = styled.svg`
  position: absolute;
  width: 0;
  height: 0;

  :hover {
    fill: url("#${props => props.gradientId}")
  }
`;

export default function MenuButton({children, ...others}) {
    const {tooltip} = others;

    // Ensure valid tooltip for unique gradient id
    if(!tooltip) {
        console.warn('Missing tooltip on MenuButton');
        return null;
    }
    const gradientId = `blocks-icon-gradient-${paramCase(tooltip)}`;

    return (
        <MenuItemStyled {...others}>
            <IconStyled gradientId={gradientId} aria-hidden="true" focusable="false">
                <linearGradient id={gradientId} x2="1" y2="1">
                    <stop offset="0%" stopColor="#00EFFB"/>
                    <stop offset="50%" stopColor="#8649E1"/>
                    <stop offset="100%" stopColor="#F900E3"/>
                </linearGradient>
            </IconStyled>
            {children}
        </MenuItemStyled>
    );
}