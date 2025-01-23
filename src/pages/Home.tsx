import React, { useState } from 'react';
import FolderWindow from '../components/FolderWindow';
import ActionWindow from '../components/ActionWindow';
import { FileMetadata } from '../interfaces/Interfaces';
import MetadataWindow from '../components/MetadataWindow';

function Home() {
  const [currentView, setCurrentView] = useState<'action' | 'file' | null>(null);
  const [currentFile, setCurrentFile] = useState<FileMetadata>({
    name: '',
    size: 0,
    type: '',
    path: '',
    isDirectory: false
  });

  return (
    <div className="home-container flex h-[85vh] overflow-p-4 gap-2.5">
      <div className="sidebar w-1/5 p-4 bg-blue-100 dark:bg-blue-800 rounded-lg overflow-y-scroll">
        <h2 className="text-lg font-semibold mb-4">Folder Structure</h2>
        <FolderWindow onFileSelect={(selectedFile: FileMetadata) => setCurrentFile(selectedFile)} />
      </div>
      <div className="viewer flex-grow p-4 bg-blue-300 dark:bg-blue-600 rounded-lg ml-2.5 overflow-y-scroll">
        <div className="flex space-x-4 mb-4">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setCurrentView('action')}
          >
            Action View
          </button>
          <button
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setCurrentView('file')}
          >
            File View
          </button>
        </div>

        <div className="mt-4">
          {currentView === 'action' && <ActionWindow file={currentFile} onUpdateFile={setCurrentFile} />}
          {currentView === 'file' && <div>File View</div>}
          {!currentView && <div>Select a view type</div>}
        </div>
      </div>

      <div className="metadata w-1/5 p-4 bg-blue-200 dark:bg-blue-700 rounded-lg ml-2.5 overflow-y-scroll">
        <MetadataWindow metadata={currentFile} />
      </div>
    </div>
  );
}

export default Home;
