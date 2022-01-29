import React from 'react';
import styled, {css} from 'styled-components';
import {MOBILE_MENU_STORE} from '../../../observables/mobileMenuStore';
import classNames from 'classnames';
import useObservableState from '../../../hooks/utils/useObservableState';
import {FiX} from 'react-icons/fi';
import {onLeftClick} from '../../../utils/eventHelpers';

const MenuContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    height: 100%;
    bottom: 0;
    right: 0;
    width: 60%;
    transition: 0.4s;
    z-index: 1000;
    //padding-top: 95px;
    opacity: .95;
    transform: translateX(100%);
    background: linear-gradient(90deg, #00131C, #022030) !important;
    backdrop-filter: blur(10px);
    gap: 0.5rem;

    ${props => props.open && css`
        transform: translateX(0);
    `}

    ${props => props.fullscreen && css`
        width: 100%;
    `}
`;

export default function MobileMenu({children, className, ...others}) {
    const [isOpen, setOpen] = useObservableState(MOBILE_MENU_STORE);

    const fullscreen = window.innerWidth < 576;

    return (
        <MenuContainer
            open={isOpen}
            fullscreen={fullscreen}
            className={classNames('px-4 text-light', className)}>
            <div
                className="clickable w-100 p-4 d-flex flex-row align-items-center justify-content-end"
                {...onLeftClick(() => setOpen(false))}>
                <FiX size="24px"/>
            </div>
            {children}
        </MenuContainer>
    );

}