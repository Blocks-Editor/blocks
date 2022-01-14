import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import useReactTooltip from '../../../hooks/useReactTooltip';

let ItemContainer = styled.div`

`;

export default function MenuItem({variant, tooltip, className, ...others}) {
    useReactTooltip();

    return (
        <ItemContainer
            className={classNames('menu-item noselect px-3 py-2 mb-0 d-inline-block text-center', variant && `text-${variant}`, className)}
            data-tip={tooltip}
            data-delay-show={100}
            {...others}>
        </ItemContainer>
    );
}