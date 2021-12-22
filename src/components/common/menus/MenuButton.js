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

export default function MenuButton({children, className, ...others}) {
    return (
        <StyledMenuItem className={classNames('menu-button', className)} {...others}>
            {children}
        </StyledMenuItem>
    );
}