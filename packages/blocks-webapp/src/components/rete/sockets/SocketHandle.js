import React from 'react';
import {paramCase} from 'change-case';
import classNames from 'classnames';
import Rete from 'rete';

// Adapted from https://github.com/retejs/react-render-plugin/blob/master/src/Socket.jsx

export function SocketHandle(props) {
    const {type, socket, innerRef, io} = props;

    let socketType = socket.findType();
    let reversed = !!socketType.data.reversed;

    let multiple = io.multipleConnections && (io instanceof Rete.Input) === !reversed;

    return (
        <div
            className={classNames(
                'socket',
                type,
                paramCase(socket.name),
                multiple && 'multiple',
                reversed && 'reversed',
                !multiple && io.connections.length && 'occupied',
                'category-' + socketType.data.category,
            )}
            title={socket.name}
            ref={el => el && innerRef(el, type, io)}>
            <div className="socket-color w-100 h-100"/>
        </div>
    );
}