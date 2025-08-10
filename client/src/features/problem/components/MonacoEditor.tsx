import Editor from "@monaco-editor/react";

interface MonacoEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
}

const MonacoEditor = ({ language, value, onChange }: MonacoEditorProps) => {
  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      language={language.toLowerCase()}
      value={value}
      onChange={(value) => onChange(value || "")}
      theme="custom-vscode-dark"
      onMount={(editor, monaco) => {
        monaco.editor.defineTheme("custom-vscode-dark", {
          base: "vs-dark",
          inherit: true,
          rules: [
            { token: "comment", foreground: "7f848e" },
            { token: "string", foreground: "98c379" },
          ],
          colors: {
            "editor.background": "#141414",
          },
        });
        monaco.editor.setTheme("custom-vscode-dark");
      }}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        wordWrap: "on",
        wrappingIndent: "indent",
        tabSize: 4,
        lineNumbers: "on",
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 3,
        renderLineHighlight: "none",
        renderWhitespace: "none",
        overviewRulerBorder: false,
        overviewRulerLanes: 0,
        detectIndentation: true,
        guides: { indentation: false },
        cursorBlinking: "expand",
        contextmenu: false,
        formatOnPaste: true,
        formatOnType: true,
        folding: true,
        foldingStrategy: "auto",
        autoClosingBrackets: "always",
        autoClosingQuotes: "always",
        autoIndent: "full",
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: "on",
        acceptSuggestionOnCommitCharacter: true,
      }}
    />
  );
};

export default MonacoEditor;
