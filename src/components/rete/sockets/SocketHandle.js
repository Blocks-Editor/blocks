import React from 'react';
import {paramCase} from 'change-case';
import classNames from 'classnames';

// Adapted from https://github.com/retejs/react-render-plugin/blob/master/src/Socket.jsx

export function SocketHandle(props) {
    const {type, socket, innerRef, io} = props;

    const createRef = el => el && innerRef(el, type, io);

    return (
        <div
            className={classNames('socket', type, paramCase(socket.name), socket.data.category && 'category-' + paramCase(socket.data.category))}
            title={socket.name}
            ref={el => createRef(el)} // force update for new IO with a same key
        />
    );
}