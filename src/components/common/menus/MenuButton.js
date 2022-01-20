import React from 'react';
import MenuItem from './MenuItem';
import styled from 'styled-components';
import classNames from 'classnames';
import useButtonTitleState from '../../../hooks/persistent/useButtonTitleState';

let StyledMenuItem = styled(MenuItem)`
    cursor: pointer;
    border-radius: 10px;
    display: flex !important;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    gap: 0.1rem;

    &.round {
        border-radius: 50% !important;
        width: 48px;
        height: 48px;
        padding: 0 !important;
    }

    &:hover {
        background: #FFF1;

        > svg {
            fill: url("#svg-block-gradient");
        }
    }
`;

export default function MenuButton({noMargin, children, title, className, ...others}) {
    const [buttonTitles, ] = useButtonTitleState();
    return (
        <StyledMenuItem className={classNames('menu-button', {'mx-3': !noMargin}, className)} {...others}>
            {children}
            {buttonTitles && title ?
                <span className="text-muted very-small">
                    {title}
                </span>
                :
                <></>
            }
        </StyledMenuItem>
    );
}