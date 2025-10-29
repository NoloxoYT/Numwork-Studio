import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface FileEntry {
  path: string;
  name: string;
  is_dir: boolean;
}

interface FileExplorerProps {
  onFileSelect: (filePath: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect }) => {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEntries() {
      try {
        const homeDir: string = await invoke('get_home_dir');
        setCurrentPath(homeDir);
      } catch (err) {
        setError(`Failed to get home directory: ${err}`);
      }
    }
    loadEntries();
  }, []);

  useEffect(() => {
    async function readDir() {
      if (!currentPath) return;
      setError(null);
      try {
        const result: FileEntry[] = await invoke('read_directory', { path: currentPath });
        setEntries(result.sort((a, b) => (b.is_dir ? 1 : 0) - (a.is_dir ? 1 : 0) || a.name.localeCompare(b.name)));
      } catch (err) {
        setError(`Failed to read directory ${currentPath}: ${err}`);
        setEntries([]);
      }
    }
    readDir();
  }, [currentPath]);

  const handleEntryClick = (entry: FileEntry) => {
    if (entry.is_dir) {
      setCurrentPath(entry.path);
    } else {
      onFileSelect(entry.path);
    }
  };

  const navigateUp = () => {
    const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
    if (parentPath) {
      setCurrentPath(parentPath);
    } else {
      // If at root, try to go to home directory if possible
      invoke('get_home_dir').then((homeDir: unknown) => setCurrentPath(homeDir as string)).catch(err => setError(`Failed to get home directory: ${err}`));
    }
  };

  return (
    <div className="file-explorer">
      <div className="path-bar">
        <button onClick={navigateUp} disabled={currentPath === '/'}>↑</button>
        <span>{currentPath}</span>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="entries">
        {entries.map((entry) => (
          <div key={entry.path} className={`file-entry ${entry.is_dir ? 'directory' : 'file'}`} onClick={() => handleEntryClick(entry)}>
            {entry.is_dir ? '📁' : '📄'} {entry.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileExplorer;
