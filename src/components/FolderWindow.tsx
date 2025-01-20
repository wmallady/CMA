import React, { useEffect, useState } from 'react';
import { FileItem, FileMetadata, FolderWindowProps } from '../interfaces/Interfaces';

type DriveType = 'network' | 'local' | 'filehold';

function FolderWindow({ onFileSelect }: FolderWindowProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDrive, setSelectedDrive] = useState<DriveType>('local');
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);

  const updateFileChildren = (childFiles: FileItem[], parentPath: string, children: FileItem[]): FileItem[] => {
    return childFiles.map((file) => {
      if (file.path === parentPath) {
        return { ...file, children };
      }
      if (file.children) {
        return { ...file, children: updateFileChildren(file.children, parentPath, children) };
      }
      return file;
    });
  };

  const handleDriveChange = async (driveType: DriveType) => {
    setIsLoading(true);
    setSelectedDrive(driveType);
    const networkFiles = await window.Electron.loadNetworkDrives();
    const localFiles = await window.Electron.loadInitialDirectory();

    try {
      switch (driveType) {
        case 'network':
          setFiles(
            networkFiles.map((drive) => ({
              name: drive.name,
              path: drive.path,
              isDirectory: true,
              children: []
            }))
          );
          break;

        case 'filehold':
          // To be implemented
          setFiles([]);
          break;

        default:
          setFiles(
            localFiles.map((file) => ({
              ...file,
              isDirectory: file.isDirectory
            }))
          );
          break;
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleDriveChange('local');
  }, []);

  const loadFolderContents = async (folderPath: string) => {
    try {
      const contents = await window.Electron.loadDirectoryContents(folderPath);
      setFiles((prevFiles) => updateFileChildren(prevFiles, folderPath, contents));
    } catch (err) {
      console.error('Error loading folder contents:', err);
    }
  };

  const handleFolderClick = async (filePath: string) => {
    setExpandedPaths((prev) => {
      const newPaths = new Set(prev);
      if (newPaths.has(filePath)) {
        newPaths.delete(filePath);
      } else {
        newPaths.add(filePath);
        // Load children if not already loaded
        loadFolderContents(filePath);
      }
      return newPaths;
    });
  };

  const getFileMetadata = async (filePath: string): Promise<FileMetadata> => {
    try {
      return await window.Electron.getFileMetadata(filePath);
    } catch (err) {
      console.error('Error getting file metadata:', err);
      throw err;
    }
  };

  const handleFileSelect = async (file: FileItem) => {
    try {
      const metadata = await getFileMetadata(file.path);
      setSelectedFile(metadata);
      onFileSelect(metadata);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const renderFileItems = (items: FileItem[]) => {
    return items.map((file) => (
      <li key={file.path} className="flex flex-col ml-4">
        <div
          role="button"
          tabIndex={0}
          className={`flex items-center p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-md cursor-pointer 
            ${selectedFile?.path === file.path ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
          onClick={() => {
            if (file.isDirectory) {
              handleFolderClick(file.path);
            }
            handleFileSelect(file);
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              if (file.isDirectory) {
                handleFolderClick(file.path);
              }
              handleFileSelect(file);
            }
          }}
        >
          <span className="mr-2">{file.isDirectory && expandedPaths.has(file.path) ? '📂' : '📄'}</span>
          <span>{file.name}</span>
        </div>
        {file.isDirectory && expandedPaths.has(file.path) && file.children && (
          <ul className="space-y-1">{renderFileItems(file.children)}</ul>
        )}
      </li>
    ));
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <select
          value={selectedDrive}
          onChange={(e) => handleDriveChange(e.target.value as DriveType)}
          className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg 
                     shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="network">Network Drive (R:)</option>
          <option value="local">Local Directory (C:)</option>
          <option value="filehold">FileHold</option>
        </select>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      )}
      {!isLoading && error && <div className="text-red-500 p-4">{error}</div>}
      {!isLoading && !error && <ul className="space-y-1 overflow-auto">{renderFileItems(files)}</ul>}
    </div>
  );
}

export default FolderWindow;
