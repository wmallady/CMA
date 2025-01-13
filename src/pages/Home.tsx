import React from 'react';
import FolderWindow from '../components/FolderWindow';

function Home() {
  return (
    <div className="home-container flex h-[85vh] overflow-p-4 gap-2.5">
      <div className="sidebar w-1/5 p-4 bg-blue-100 dark:bg-blue-800 rounded-lg overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Folder Structure</h2>
        <FolderWindow />
      </div>
      <div className="viewer flex-grow p-4 bg-blue-300 dark:bg-blue-600 rounded-lg ml-2.5 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">File Viewer</h2>
        <p>This is where the file content will be displayed.</p>
      </div>
      <div className="metadata w-1/5 p-4 bg-blue-200 dark:bg-blue-700 rounded-lg ml-2.5 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">File Metadata</h2>
        <p>Name: example.txt</p>
        <p>Size: 14KB</p>
        <p>Type: Text File</p>
      </div>
    </div>
  );
}

export default Home;
