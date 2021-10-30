import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

let ItemContainer = styled.div`
    
`;

export default function MenuItem({variant, className, ...others}) {
    return (
        <ItemContainer
            className={classNames(`menu-item noselect h3 px-3 py-1 mb-0 d-inline-block text-center text-${variant || 'secondary'}`, className)}
            {...others}>
        </ItemContainer>
    );
}