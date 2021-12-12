import MonacoEditor from '@monaco-editor/react';
import {configureMonaco} from '../../config/configureMonaco';
import useThemeState from '../../hooks/persistent/useThemeState';

export default function CodeEditor({value, onChange, readOnly, ...others}) {
    // const monaco = useMonaco();
    const [theme] = useThemeState();

    const onEditorChange = (newValue) => {
        onChange?.(newValue);
    };

    return (
        <MonacoEditor
            // width="30vh"
            // height="40vh"
            theme={theme.monaco || 'vs-dark'}
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
                readOnly,
            }}
            {...others}
        />
    );
}