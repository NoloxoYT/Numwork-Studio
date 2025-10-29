import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { invoke } from "@tauri-apps/api/core";
import FileExplorer from "./components/FileExplorer";
import "./App.css";

function App() {
  const [code, setCode] = useState<string>(`#include <iostream>

int main() {
    std::cout << "Hello, Numwork Studio!" << std::endl;
    return 0;
}`);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFileContent() {
      if (currentFilePath) {
        setError(null);
        try {
          const content: string = await invoke('read_file_content', { path: currentFilePath });
          setCode(content);
        } catch (err) {
          setError(`Failed to read file ${currentFilePath}: ${err}`);
          setCode(`// Error: Failed to load file content.\n// ${err}`);
        }
      }
    }
    loadFileContent();
  }, [currentFilePath]);

  function handleEditorChange(value: string | undefined) {
    setCode(value || "");
  }

  const handleFileSelect = (filePath: string) => {
    setCurrentFilePath(filePath);
  };

  return (
    <div className="app-container">
      <FileExplorer onFileSelect={handleFileSelect} />
      <div className="editor-panel">
        {error && <div className="error-message">{error}</div>}
        <div className="file-path-display">
          {currentFilePath ? `Editing: ${currentFilePath}` : "No file selected"}
        </div>
        <Editor
          height="calc(100vh - 60px)" // Adjust height for path display and potential error message
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
    </div>
  );
}

export default App;
