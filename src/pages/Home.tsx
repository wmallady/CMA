import React from 'react';
import FolderWindow from '../components/FolderWindow';

function Home() {
  function getFiles() {
    // get all files in the current directory and return them as an array
    return null;
  }

  function getFilePath() {
    // get the path of the current file and return it as a string
    return null;
  }

  function getFileContent(){
    // get the content of the current file and return it as a string
    return null;
  }

  function makeFilePathDisplayable() {
    // make the file path displayable and return it as a string
    return null;
  }

  function getFileMetaData() {
    // get the metadata of the current file and return it as an object
    return null;
  }

  function populateFileViewer() { //send file path strings to viw window
    return null;
  }

  function populateFileMetaData() { // populate metadata fields
    return null;
  }

  function populateFileContentView(){
    // populate the file content view with the content of the current file
    return null;
  }



  return (
    <div className="home-container flex h-screen p-4 gap-2.5">
      <div className="sidebar w-1/5 p-4 bg-blue-100 dark:bg-blue-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Folder Structure</h2>
        <FolderWindow />
      </div>
      <div className="viewer flex-grow p-4 bg-blue-300 dark:bg-blue-600 rounded-lg ml-2.5">
        <h2 className="text-lg font-semibold mb-4">File Viewer</h2>
        <p>This is where the file content will be displayed.</p>
      </div>
      <div className="metadata w-1/5 p-4 bg-blue-200 dark:bg-blue-700 rounded-lg ml-2.5">
        <h2 className="text-lg font-semibold mb-4">File Metadata</h2>
        <p>Name: example.txt</p>
        <p>Size: 14KB</p>
        <p>Type: Text File</p>
      </div>
    </div>
  );
}

export default Home;
