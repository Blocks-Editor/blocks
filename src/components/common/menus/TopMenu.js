import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import {IconContext} from 'react-icons';
import {ReactComponent as Gradient} from '../../../assets/icons/gradient.svg';

const MenuContainer = styled.div`
    background: #FFF;
    margin-bottom: 3px;
    padding: 2px;
    position: relative;
    background-clip: padding-box;
    z-index: 10;

    :before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 2px;
        background: linear-gradient(90deg, #00EFFB, #8649E1, #F900E3);
        z-index: -1;
        margin-bottom: -2px;
    }

`;

const HiddenGradient = styled(Gradient)`
    height: 0;
    width: 0;
`;

export default function TopMenu({className, children, ...others}) {
    return (
        <MenuContainer className={classNames('top-menu text-secondary d-flex justify-content-start align-items-center', className)} {...others}>
            <HiddenGradient/>
            <IconContext.Provider value={{style: {verticalAlign: 'bottom'/*, transform: 'translateY(-1px)'*/}}}>
                {children}
            </IconContext.Provider>
        </MenuContainer>
    );
}