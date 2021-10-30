import MonacoEditor, { useMonaco } from "@monaco-editor/react";

export default function CodeEditor({id, onChange}) {

    let monaco=useMonaco()



    return (
        <MonacoEditor

        />
    );
}