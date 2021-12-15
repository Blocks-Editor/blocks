import React, {useCallback, useContext, useEffect, useState} from 'react';
import classNames from 'classnames';
import Rete, {Output} from 'rete';
import ConnectionAwareListContext from '../../../contexts/ConnectionAwareListContext';
import useReactTooltip from '../../../hooks/useReactTooltip';

// Derived from: https://github.com/retejs/react-render-plugin/blob/master/src/Socket.jsx

export function SocketHandle(props) {
    const {type, propKey, socket, innerRef, io} = props;

    const [relevant, setRelevant] = useState(false);
    const [requested, setRequested] = useState(null);

    const connectionAwareList = useContext(ConnectionAwareListContext);

    const socketType = socket.findType();
    const reversed = !!socketType.data.reversed;

    // Does the socket accept multiple inputs?
    const multiple = io.multipleConnections && (io instanceof Rete.Input) !== reversed;

    // console.log('redraw');////

    // let socketRef;
    const bindRef = el => {
        // socketRef = el;
        el && innerRef(el, type, io);
    };

    // Update whether the socket is requesting a connection
    let timeout;
    const updateRequested = useCallback(() => {
        clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        timeout = setTimeout(() => {
            // TODO: memory leak?
            let requested = !io.connections.length;
            if(requested) {
                const prop = socket.findProp?.();
                requested = !!(prop?.input && (
                    prop.request || (!prop.optional && !multiple && !io.control)
                ));
            }
            setRequested(requested);
        });
    }, [io, multiple, socket]);

    if(requested === null) {
        updateRequested();
    }

    useEffect(() => {
        const listener = (starting, connectionIO) => {
            if(starting) {
                if((io instanceof Output) === (connectionIO instanceof Output)) {
                    return;
                }
                if(io.node && io.node === connectionIO.node) {
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
            updateRequested();
        };
        connectionAwareList.push(listener);
        return () => {
            let index = connectionAwareList.indexOf(listener);
            if(index !== -1) {
                connectionAwareList.splice(index, 1);
            }
            else {
                console.warn('Missing connection aware listener on cleanup');
            }
            clearTimeout(timeout);///
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, io, connectionAwareList, updateRequested]);

    useReactTooltip();

    const socketColor = (
        <div className="socket-color w-100 h-100"/>
    );

    return (
        <div
            ref={bindRef}
            className={classNames(
                'socket',
                type,
                propKey && 'key-' + propKey,
                relevant && 'relevant',
                multiple && 'multiple',
                reversed && 'reversed',
                requested && 'requested',
                !multiple && io.connections.length && 'occupied',
                'category-' + socketType.data.category,
            )}
            // title={socket.name}
            data-tip={`${socket.findLabel?.() || socket.name}`}>
            <div className="requested-wrapper w-100 h-100">
                {socketColor}
            </div>
        </div>
    );
}