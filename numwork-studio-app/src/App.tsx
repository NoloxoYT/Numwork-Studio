import { useState } from "react";
import Editor from "@monaco-editor/react";
import "./App.css";

function App() {
  const [code, setCode] = useState<string>(`#include <iostream>

int main() {
    std::cout << "Hello, Numwork Studio!" << std::endl;
    return 0;
}`);

  function handleEditorChange(value: string | undefined) {
    setCode(value || "");
  }

  return (
    <div className="editor-container">
      <Editor
        height="90vh"
        language="cpp"
        theme="vs-dark"
        value={code}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}

export default App;
