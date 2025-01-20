import React from 'react';
import { MetadataWindowProps } from '../interfaces/Interfaces';

export default function MetadataWindow({ metadata }: MetadataWindowProps) {
  if (!metadata) return <div>No file selected</div>;

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  const formatDate = (date: Date | undefined) => {
    return date?.toLocaleString() || 'N/A';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">File Metadata</h2>
      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Basic Info</h3>
        <p className="flex justify-between">
          <span>Name:</span> <span>{metadata.name}</span>
        </p>
        <p className="flex justify-between">
          <span>Type:</span> <span>{metadata.type || 'N/A'}</span>
        </p>
        <p className="flex justify-between">
          <span>Size:</span> <span>{metadata.size ? formatSize(metadata.size) : 'N/A'}</span>
        </p>
        <p className="flex justify-between">
          <span>Directory:</span> <span>{metadata.isDirectory ? 'Yes' : 'No'}</span>
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Timestamps</h3>
        <p className="flex justify-between">
          <span>Created:</span> <span>{formatDate(metadata.created)}</span>
        </p>
        <p className="flex justify-between">
          <span>Modified:</span> <span>{formatDate(metadata.modified)}</span>
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Location</h3>
        <p className="flex justify-between">
          <span>Path:</span> <span className="truncate">{metadata.path}</span>
        </p>
        <p className="flex justify-between">
          <span>Parent:</span> <span className="truncate">{metadata.parent || 'N/A'}</span>
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Permissions</h3>
        <p className="flex justify-between">
          <span>Readable:</span> <span>{metadata.readable ? 'Yes' : 'No'}</span>
        </p>
        <p className="flex justify-between">
          <span>Writable:</span> <span>{metadata.writable ? 'Yes' : 'No'}</span>
        </p>
        <p className="flex justify-between">
          <span>Executable:</span> <span>{metadata.executable ? 'Yes' : 'No'}</span>
        </p>
      </div>
    </div>
  );
}
