import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import {FiX} from 'react-icons/fi';
import {onLeftClick} from '../../utils/eventHelpers';
import {EDITOR_MENU_STORE} from '../../observables/editorMenuStore';

const TitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export default function MenuModal({title, className, children, ...others}) {

    return (
        <div
            className={classNames('p-3', className)}
            {...others}>
            {title && (
                <>
                    <TitleContainer>
                        <h3 className="fw-light mb-0">{title}</h3>
                        <div
                            className="clickable p-2 mb-1"
                            {...onLeftClick(() => EDITOR_MENU_STORE.set(null))}>
                            <FiX size={18}/>
                        </div>
                    </TitleContainer>
                    <hr/>
                </>
            )}
            {children}
        </div>
    );
}