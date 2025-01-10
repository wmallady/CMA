import React, { useEffect, useState } from 'react';

interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileItem[];
}

export interface IElectronAPI {
  loadDirectoryContents: (dirPath: string) => Promise<FileItem[]>;
  loadInitialDirectory: () => Promise<FileItem[]>;
  darkMode: {
    toggle: () => void;
    system: () => void;
  };
}

declare global {
  interface Window {
    Electron: IElectronAPI;
  }
}

function FolderWindow() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialDirectory = async () => {
      try {
        const fileItems: FileItem[] = await window.Electron.loadInitialDirectory();

        setFiles(fileItems);
        setIsLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setIsLoading(false);
      }
    };
    loadInitialDirectory();
  }, []);
  const handleFolderClick = async (dirPath: string) => {
    try {
      const fileItems: FileItem[] = await window.Electron.loadDirectoryContents(dirPath);
      setFiles(fileItems);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const renderFileItems = (items: FileItem[]) => {
    return items.map((file) => (
      <li key={file.path} className="flex flex-col ml-4">
        <div
          className="flex items-center p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-md cursor-pointer"
          onClick={() => file.isDirectory && handleFolderClick(file.path)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              if (file.isDirectory) handleFolderClick(file.path);
            }
          }}
        >
          <span className="mr-2">{file.isDirectory ? '📁' : '📄'}</span>
          <span>{file.name}</span>
        </div>
        {file.children && file.children.length > 0 && <ul className="space-y-1">{renderFileItems(file.children)}</ul>}
      </li>
    ));
  };

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <ul className="space-y-1">{renderFileItems(files)}</ul>
    </div>
  );
}

export default FolderWindow;
