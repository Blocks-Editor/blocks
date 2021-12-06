import MonacoEditor from '@monaco-editor/react';
import {configureMonaco} from '../../config/configureMonaco';

export default function CodeEditor({value, onChange, ...others}) {

    // const monaco = useMonaco();

    const onEditorChange = (newValue) => {
        onChange?.(newValue);
    };

    return (
        <MonacoEditor
            // width="30vh"
            // height="40vh"
            theme="vs-dark"
            defaultLanguage="motoko"
            beforeMount={configureMonaco}
            value={value}
            // path={fileName}
            onChange={onEditorChange}
            options={{
                tabSize: 2,
                minimap: {enabled: false},
                wordWrap: 'off',
                // wrappingIndent: 'indent',
                scrollBeyondLastLine: false,
                fontSize: 16,
            }}
            {...others}
        />
    );
}