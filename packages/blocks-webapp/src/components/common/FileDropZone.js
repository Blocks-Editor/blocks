import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import styled from 'styled-components';
import classNames from 'classnames';

// TODO: fix .dragging

const DropContainer = styled.div`
  padding: 2em;
  border: 2px #0005 dashed;

  .dragging, :hover {
    background: #0002;
  }
`;

export default function FileDropZone({onFile, onFileContent}) {

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

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        maxFiles: 1,
        onDrop,
    });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()}/>
            <DropContainer className={classNames('clickable text-center text-muted rounded-3', isDragActive && 'dragging')}>
                <h5>Import a .blocks file...</h5>
            </DropContainer>
        </div>
    );
}