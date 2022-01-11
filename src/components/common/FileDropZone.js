import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import classNames from 'classnames';
import {onLeftPress} from '../../utils/eventHelpers';

export default function FileDropZone({options, onFile, onFileContent, className, children, ...others}) {

    const onDrop = useCallback(files => {
        if(files.length) {
            const file = files[0];
            onFile?.(file);
            if(onFileContent) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    onFileContent(e.target.result);
                };
                reader.readAsText(file);
            }
        }
    }, [onFile, onFileContent]);

    const {getRootProps, getInputProps, isDragActive, open} = useDropzone({
        maxFiles: 1,
        onDrop,
        noClick: true,
        ...options,
    });

    return (
        <div
            className={classNames(className, !options.noClick && 'clickable', isDragActive && 'dragging')}
            {...(options?.noClick ? {} : onLeftPress(() => open()))}
            {...others}
            {...getRootProps()}>
            <input {...getInputProps()}/>
            {children}
        </div>
    );
}