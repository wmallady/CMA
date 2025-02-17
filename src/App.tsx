import React, { useEffect } from 'react';
import AppBar from './components/AppBar';
import SwitchDarkMode from './components/SwitchDarkMode';
import HamburgerMenu from './components/HamburgerMenu';
import Home from './pages/Home';

function App() {
  useEffect(() => {
    window.Main.removeLoading();
  }, []);

  return (
    <div className="flex flex-col">
      {window.Main && (
        <div className="flex-none">
          <AppBar />
        </div>
      )}
      <div className="flex-auto">
        <div className="ml-4 mr-4 mt-4 flex items-center justify-between">
          <SwitchDarkMode />
          <HamburgerMenu />
        </div>
        <Home />
      </div>
    </div>
  );
}

export default App;
