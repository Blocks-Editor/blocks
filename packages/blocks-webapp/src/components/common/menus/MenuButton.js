import React from 'react';
import MenuItem from './MenuItem';
import styled from 'styled-components';

let StyledMenuItem = styled(MenuItem)`
    cursor: pointer;
    border-radius: 10px;

    :hover {
        background: #F0F0F0;
    }

    :hover > svg {
        fill: url("#svg-block-gradient");
    }
`;

const StyledIcon = styled.svg`
    position: absolute;
    width: 0;
    height: 0;
`;

export default function MenuButton({children, ...others}) {
    return (
        <StyledMenuItem {...others} className={"menu-button"}>
            <StyledIcon aria-hidden="true" focusable="false"/>
            {children}
        </StyledMenuItem>
    );
}