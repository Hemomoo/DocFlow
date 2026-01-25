'use client';

import React from 'react';
import { create } from 'tinykeys';

export function KeyboardShortcuts() {
  React.useEffect(() => {
    const unsubscribe = create([
      ['m', (e) => {
        e.preventDefault();
        document.querySelector('[data-lk-toggle-source="microphone"]')?.dispatchEvent(
          new MouseEvent('click', { bubbles: true })
        );
      }],
      ['v', (e) => {
        e.preventDefault();
        document.querySelector('[data-lk-toggle-source="camera"]')?.dispatchEvent(
          new MouseEvent('click', { bubbles: true })
        );
      }],
      ['s', (e) => {
        e.preventDefault();
        document.querySelector('[data-lk-toggle-source="screen_share"]')?.dispatchEvent(
          new MouseEvent('click', { bubbles: true })
        );
      }],
      ['c', (e) => {
        e.preventDefault();
        document.querySelector('[data-lk-toggle-source="chat"]')?.dispatchEvent(
          new MouseEvent('click', { bubbles: true })
        );
      }],
    ]);

    return () => {
      unsubscribe();
    };
  }, []);

  return null;
}
