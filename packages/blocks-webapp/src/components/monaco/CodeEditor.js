import MonacoEditor from "@monaco-editor/react";
import {configureMonaco} from '../../config/configureMonaco';

export default function CodeEditor({value, onChange}) {

    // const monaco = useMonaco();

    const onEditorChange = (newValue) => {
        onChange?.(newValue);
    };

    return (
        <MonacoEditor
            defaultLanguage="motoko"
            beforeMount={configureMonaco}
            value={value}
            // path={fileName}
            onChange={onEditorChange}
            options={{
                minimap: {enabled: false},
                wordWrap: 'on',
                wrappingIndent: 'indent',
                scrollBeyondLastLine: false,
                fontSize: 16,
            }}
        />
    );
}