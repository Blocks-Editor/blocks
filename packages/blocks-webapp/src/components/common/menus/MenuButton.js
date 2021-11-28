import React from 'react';
import MenuItem from './MenuItem';
import styled from 'styled-components';
import classNames from 'classnames';

let StyledMenuItem = styled(MenuItem)`
    cursor: pointer;
    border-radius: 10px;
    
    &.round {
        border-radius: 50% !important;
        width: 48px;
        height: 48px;
        padding: 0 !important;
    }

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

export default function MenuButton({children, className, ...others}) {
    return (
        <StyledMenuItem {...others} className={classNames("menu-button", className)}>
            <StyledIcon aria-hidden="true" focusable="false"/>
            {children}
        </StyledMenuItem>
    );
}