import React from 'react';
import {paramCase} from 'change-case';
import classNames from 'classnames';
import Rete from 'rete';

// Adapted from https://github.com/retejs/react-render-plugin/blob/master/src/Socket.jsx

export function SocketHandle(props) {
    const {type, socket, innerRef, io} = props;

    let reversed = !!socket.data.reversed;

    return (
        <div
            className={classNames(
                'socket',
                type,
                paramCase(socket.name),
                io.multipleConnections && (io instanceof Rete.Input) === !socket.data.reversed && 'multiple',
                reversed && 'reversed',
                socket.data.category && 'category-' + paramCase(socket.data.category),
            )}
            title={socket.name}
            ref={el => el && innerRef(el, type, io)}
        />
    );
}