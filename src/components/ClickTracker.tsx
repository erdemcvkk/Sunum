'use client';

import { useEffect, useCallback, useRef } from 'react';

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  const key = 'fantas_session_id';
  let sessionId = localStorage.getItem(key);
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem(key, sessionId);
  }
  return sessionId;
}

export default function ClickTracker() {
  const sessionIdRef = useRef<string>('');
  const isAdminRef = useRef<boolean>(false);

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
    // Check if admin by looking for the cookie presence via a quick HEAD-like check
    // Since admin_auth is httpOnly, we check by attempting to detect if we're on admin pages
    // Better: we'll just send it and let the server skip if admin
    isAdminRef.current = window.location.pathname.startsWith('/admin');
  }, []);

  const sendClick = useCallback(async (data: {
    elementType: string;
    elementText: string;
    trackId: string;
    pageUrl: string;
    sectionId: string;
  }) => {
    // Don't track if on admin pages
    if (isAdminRef.current) return;

    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          sessionId: sessionIdRef.current,
        }),
        // Use keepalive for reliability when navigating away
        keepalive: true,
      });
    } catch {
      // Silently fail - analytics should never break UX
    }
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Find the closest element with data-track attribute
      const target = e.target as HTMLElement;
      const trackedElement = target.closest('[data-track]') as HTMLElement | null;

      if (!trackedElement) return;

      const trackId = trackedElement.getAttribute('data-track') || '';
      const elementText = (trackedElement.textContent || '').trim().slice(0, 200);
      const elementType = trackedElement.tagName.toLowerCase() === 'a' ? 'link' 
        : trackedElement.tagName.toLowerCase() === 'button' ? 'button' 
        : 'element';
      
      // Find section id
      const section = trackedElement.closest('[id]') as HTMLElement | null;
      const sectionId = section?.id || '';

      sendClick({
        elementType,
        elementText,
        trackId,
        pageUrl: window.location.pathname,
        sectionId,
      });
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [sendClick]);

  // This component renders nothing
  return null;
}
