// Native
import * as path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

// Packages
import { BrowserWindow, app, ipcMain, nativeTheme } from 'electron';
import isDev from 'electron-is-dev';

import { NetworkDrive } from '../src/interfaces/Interfaces';

const height = 1080;
const width = 1920;

function createWindow() {
  // Create the browser window.
  const window = new BrowserWindow({
    width,
    height,
    //  change to false to use AppBar
    frame: false,
    show: true,
    resizable: true,
    fullscreenable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const port = process.env.PORT || 3000;
  const url = isDev ? `http://localhost:${port}` : path.join(__dirname, '../dist-vite/index.html');

  // and load the index.html of the app.
  if (isDev) {
    window?.loadURL(url);
  } else {
    window?.loadFile(url);
  }
  // Open the DevTools.
  // window.webContents.openDevTools();

  // For AppBar
  ipcMain.on('minimize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMinimized() ? window.restore() : window.minimize();
    // or alternatively: win.isVisible() ? win.hide() : win.show()
  });
  ipcMain.on('maximize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMaximized() ? window.restore() : window.maximize();
  });

  ipcMain.on('close', () => {
    window.close();
  });

  nativeTheme.themeSource = 'dark';
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// FUNCTIONS

function isRelevantFile(dirPath: string, item: fs.Dirent): boolean {
  const relevantExtensions = ['.doc', '.docx', '.pdf', '.txt'];
  const itemPath = path.join(dirPath, item.name);
  const extension = path.extname(item.name).toLowerCase();

  try {
    const stats = fs.statSync(itemPath);
    if (stats.isFile() && relevantExtensions.includes(extension)) {
      return true;
    } else if (stats.isDirectory()) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    console.error(`Error checking file relevance: ${error.message}`);
    return false;
  }


}

const execAsync = promisify(exec);

async function getNetworkDrives(): Promise<NetworkDrive[]> {
  if (process.platform === 'win32') {
    try {
      const { stdout } = await execAsync('wmic logicaldisk where drivetype=4 get caption,providername');
      return stdout
        .trim()
        .split('\n')
        .slice(1) // Remove header
        .map((line) => {
          const [caption] = line.trim().split(/\s+/);
          return {
            name: caption,
            path: `${caption}\\`,
            isNetwork: true
          };
        });
    } catch (error) {
      console.error('Error getting network drives:', error);
      return [];
    }
  } else {
    // For Mac/Linux, check /Volumes or /mnt
    const mountPath = process.platform === 'darwin' ? '/Volumes' : '/mnt';
    try {
      const { stdout } = await execAsync(`ls -l ${mountPath}`);
      return stdout
        .trim()
        .split('\n')
        .filter((line) => line.includes('->')) // Filter symbolic links
        .map((line) => {
          const name = line.split(' ').pop() as string;
          return {
            name,
            path: `${mountPath}/${name}`,
            isNetwork: true
          };
        });
    } catch (error) {
      console.error('Error getting network drives:', error);
      return [];
    }
  }
}

/* async function loadDirectoryContents(
  dirPath: string
): Promise<{ name: string; path: string; isDirectory: boolean; children: any[] }[]> {
  const items = await fs.promises.readdir(dirPath, { withFileTypes: true });

  const filteredItems = items.filter((item) => {
    // Exclude hidden files and system files
    return !item.name.startsWith('.') && !isSystemFile(dirPath, item);
  });

  return Promise.all(
    filteredItems.map(async (item) => {
      const itemPath = path.join(dirPath, item.name);
      return {
        name: item.name,
        path: itemPath,
        isDirectory: item.isDirectory(),
        children: item.isDirectory() ? await loadDirectoryContents(itemPath) : []
      };
    })
  );
} */

/* ipcMain.handle('load-initial-directory', async () => {
  const homeDir = process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME;
  if (!homeDir) {
    throw new Error('Could not determine home directory');
  }

  const items = await fs.promises.readdir(homeDir, { withFileTypes: true });
  const filteredItems = items.filter((item) => !item.name.startsWith('.') && !isSystemFile(homeDir, item));

  return [
    { name: '..', path: path.join(homeDir, '..'), isDirectory: true },
    ...filteredItems.map((item) => ({
      name: item.name,
      path: path.join(homeDir, item.name),
      isDirectory: item.isDirectory()
    }))
  ];
});
*/

ipcMain.handle('load-directory-contents', async (_event, dirPath: string) => {
  try {
    const files = await fs.promises.readdir(dirPath, { withFileTypes: true });

    const fileItems = await Promise.all(
      files
        .filter((file) => !file.name.startsWith('.') && isRelevantFile(dirPath, file))
        .map(async (dirent) => {
          const filePath = path.join(dirPath, dirent.name);
          const stats = await fs.promises.stat(filePath);

          return {
            name: dirent.name,
            path: filePath,
            isDirectory: stats.isDirectory(),
            children: [] // Children will be loaded on expansion
          };
        })
    );

    return [
      {
        name: '..',
        path: path.join(dirPath, '..'),
        isDirectory: true,
        children: []
      },
      ...fileItems
    ];
  } catch (error) {
    console.error('Error loading directory contents:', error);
    throw error;
  }
});

ipcMain.handle('get-network-drives', async () => {
  return getNetworkDrives();
});

// Update loadInitialDirectory to include network drives
ipcMain.handle('load-initial-directory', async () => {
  try {
    const homeDir = process.platform === 'win32' ? `C:\\Users\\${process.env.USERNAME}` : process.env.HOME;

    if (!homeDir) {
      throw new Error('Could not determine home directory');
    }

    console.log('Loading from directory:', homeDir);

    const networkDrives = await getNetworkDrives();
    const localFiles = await fs.promises.readdir(homeDir, { withFileTypes: true });

    const filteredLocalFiles = await Promise.all(
      localFiles
        .filter((localFile) => !localFile.name.startsWith('.') && isRelevantFile(homeDir, localFile))
        .map(async (dirent) => {
          const filePath = path.join(homeDir, dirent.name);
          const stats = await fs.promises.stat(filePath);

          return {
            name: dirent.name,
            path: filePath,
            isDirectory: stats.isDirectory(),
            children: stats.isDirectory() ? [] : undefined
          };
        })
    );

    console.log('Filtered local files:', filteredLocalFiles);

    return [...networkDrives, ...filteredLocalFiles];
  } catch (error) {
    console.error('Error in load-initial-directory:', error);
    throw error;
  }
});

ipcMain.handle('get-file-metadata', async (_event, filePath: string) => {
  try {
    const stats = await fs.promises.stat(filePath);
    return {
      name: path.basename(filePath),
      path: filePath,
      size: stats.size,
      type: path.extname(filePath) || 'directory',
      created: stats.birthtime,
      modified: stats.mtime,
      isDirectory: stats.isDirectory()
    };
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw error;
  }
});
