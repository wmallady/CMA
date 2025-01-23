export interface NetworkDrive {
  name: string;
  path: string;
  isNetwork: boolean;
}

export interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileItem[];
}

export interface FileMetadata {
  name: string;
  path: string;
  size?: number;
  type: string;
  created?: Date;
  modified?: Date;
  readable?: boolean;
  writable?: boolean;
  executable?: boolean;
  parent?: string;
  isDirectory: boolean;
  internalContact?: string;
  internalContactEmail?: string;
  externalContact?: string;
  externalContactEmail?: string;
  renewalDate?: string | Date;
}

export interface ActionWindowProps {
  file: FileMetadata;
  onUpdateFile: (updatedFile: FileMetadata) => void;
}

export interface FolderWindowProps {
  onFileSelect: (file: FileMetadata) => void;
}

export interface MetadataWindowProps {
  metadata: FileMetadata | null;
}

export interface IElectronAPI {
  loadDirectoryContents: (dirPath: string) => Promise<FileItem[]>;
  loadInitialDirectory: () => Promise<FileItem[]>;
  loadNetworkDrives: () => Promise<NetworkDrive[]>;
  getFileMetadata: (filePath: string) => Promise<FileMetadata>;
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

export interface ViewProps {
  actionWindowVisible: boolean;
  fileViewWindowVisible: boolean;
}
