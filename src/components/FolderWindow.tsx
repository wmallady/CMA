import React, { useEffect, useState } from 'react';

interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
}

function FolderWindow() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialDirectory = async () => {
      try {
        const fileItems: FileItem[] = await window.Electron.getFiles();

        setFiles(fileItems);
        setIsLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setIsLoading(false);
      }
    };
    loadInitialDirectory();
  }, []);

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
      <ul className="space-y-1">
        {files.map((file) => (
          <li
            key={file.path}
            className="flex items-center p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-md cursor-pointer"
          >
            <span className="mr-2">{file.isDirectory ? '📁' : '📄'}</span>
            <span>{file.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FolderWindow;
