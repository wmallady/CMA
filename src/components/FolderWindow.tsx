import React, { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';

function FolderWindow() {
  const [directoryStructure, setDirectoryStructure] = useState<any>(null);

  const getDirectoryStructure = (dirPath: string) => {
    const structure: any = {};
    const items = fs.readdirSync(dirPath);

    items.forEach((item) => {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        structure[item] = getDirectoryStructure(itemPath);
      } else {
        structure[item] = path.extname(item);
      }
    });

    return structure;
  };

  useEffect(() => {
    const homeDir = process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME;
    if (homeDir) {
      const structure = getDirectoryStructure(homeDir);
      setDirectoryStructure(structure);
    }
  }, []);

  const renderDirectory = (structure: any) => {
    return (
      <ul>
        {Object.keys(structure).map((key) => (
          <li key={key}>
            {key}
            {typeof structure[key] === 'object' ? renderDirectory(structure[key]) : ` (${structure[key]})`}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h1>Directory Structure</h1>
      {directoryStructure ? renderDirectory(directoryStructure) : <p>Loading...</p>}
    </div>
  );
}

export default FolderWindow;
