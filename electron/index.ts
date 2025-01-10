// Native
import * as path from 'path';
import fs from 'fs';

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent, nativeTheme } from 'electron';
import isDev from 'electron-is-dev';

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

function isSystemFile(dirPath: string, item: fs.Dirent): boolean {
  const itemPath = path.join(dirPath, item.name);
  if (process.platform === 'win32') {
    try {
      const stats = fs.statSync(itemPath);
      return !!(stats.mode && fs.constants.S_IFDIR);
    } catch (error) {
      return false;
    }
  }
  return false;
}

async function loadDirectoryContents(
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
}

ipcMain.handle('load-initial-directory', async () => {
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

ipcMain.handle('load-directory-contents', async (event, dirPath) => {
  const items = await fs.promises.readdir(dirPath, { withFileTypes: true });
  const filteredItems = items.filter((item) => !item.name.startsWith('.') && !isSystemFile(dirPath, item));

  const fileItems = await Promise.all(
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

  return [{ name: '..', path: path.join(dirPath, '..'), isDirectory: true }, ...fileItems];
});

ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send('message', 'common.hiElectron'), 500);
});
