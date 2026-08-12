'use client';

import { useEffect } from 'react';

export default function ProtectionProvider() {
  useEffect(() => {
    // Disable right click globally
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable image dragging
    const handleDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault();
      }
    };

    // Disable key shortcuts like Ctrl+S (save), Ctrl+U (view source), F12, and DevTools combinations
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S, Ctrl+U, Ctrl+P, etc.
      if (e.ctrlKey && (e.key === 's' || e.key === 'u' || e.key === 'S' || e.key === 'U' || e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
      }

      // F12 key
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
      }

      // Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + Shift + C
      if (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J' || e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
      }

      // Detect PrintScreen key press
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        // Temporarily hide content before screenshot triggers
        document.body.style.visibility = 'hidden';
        
        // Try to clear clipboard
        try {
          navigator.clipboard.writeText('Bu web sitesinden ekran görüntüsü alınması engellenmiştir.');
        } catch (err) {
          console.warn('Clipboard write failed:', err);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        // Restore content visibility quickly
        setTimeout(() => {
          document.body.style.visibility = 'visible';
        }, 300);

        try {
          navigator.clipboard.writeText('Bu web sitesinden ekran görüntüsü alınması engellenmiştir.');
        } catch (err) {}
      }
    };

    // Infinite Debugger Loop to freeze DevTools if opened by any means
    const startDebuggerLoop = () => {
      const check = function() {
        const doubleCheck = function() {
          if (typeof window !== 'undefined') {
            // eslint-disable-next-line no-debugger
            debugger;
          }
        };
        doubleCheck();
      };
      
      const interval = setInterval(check, 100);
      return interval;
    };

    const debuggerInterval = startDebuggerLoop();

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      clearInterval(debuggerInterval);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return null;
}
