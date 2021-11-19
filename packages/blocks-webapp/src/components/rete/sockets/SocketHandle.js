import React, {useContext, useEffect, useState} from 'react';
import {paramCase} from 'change-case';
import classNames from 'classnames';
import Rete, {Output} from 'rete';
import ConnectionAwareListContext from '../../../contexts/ConnectionAwareListContext';

// Derived from: https://github.com/retejs/react-render-plugin/blob/master/src/Socket.jsx

export function SocketHandle(props) {
    const {type, socket, innerRef, io} = props;

    const [relevant, setRelevant] = useState(false);

    const connectionAwareList = useContext(ConnectionAwareListContext);

    useEffect(() => {
        const listener = (starting, connectionIO) => {
            if(starting) {
                if((io instanceof Output) === (connectionIO instanceof Output)) {
                    return;
                }
                let [input, output] = (io instanceof Output) === !!socket.data.reversed
                    ? [io, connectionIO] : [connectionIO, io];

                let [inputType, outputType] = [input.socket.findType?.(), output.socket.findType?.()];

                if(outputType && inputType?.isSubtype(outputType)) {
                    setRelevant(true);
                }
            }
            else {
                setRelevant(false);
            }
        };
        connectionAwareList.push(listener);
        return () => {
            let index = connectionAwareList.indexOf(listener);
            if(index !== -1) {
                connectionAwareList.splice(index, 1);
            }
        };
    }, [socket, connectionAwareList, io]);

    let socketType = socket.findType();
    let reversed = !!socketType.data.reversed;

    let multiple = io.multipleConnections && (io instanceof Rete.Input) === !reversed;

    return (
        <div
            className={classNames(
                'socket',
                type,
                paramCase(socket.name),
                relevant && 'relevant',
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