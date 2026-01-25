'use client';

import React from 'react';
import { useLocalParticipant, useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';

interface SettingsMenuProps {
  onClose?: () => void;
}

export function SettingsMenu({ onClose }: SettingsMenuProps) {
  const { localParticipant } = useLocalParticipant();
  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <div className="lk-settings-menu">
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="lk-button lk-button-menu"
        aria-label="设置"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {showSettings && (
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            right: '16px',
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '16px',
            minWidth: '280px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'white' }}>
            设置
          </h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#999' }}>
              摄像头
            </label>
            <select
              style={{
                width: '100%',
                padding: '8px',
                background: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '4px',
                color: 'white',
              }}
            >
              <option>默认摄像头</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#999' }}>
              麦克风
            </label>
            <select
              style={{
                width: '100%',
                padding: '8px',
                background: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '4px',
                color: 'white',
              }}
            >
              <option>默认麦克风</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#999' }}>
              扬声器
            </label>
            <select
              style={{
                width: '100%',
                padding: '8px',
                background: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '4px',
                color: 'white',
              }}
            >
              <option>默认扬声器</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#999' }}>高清视频</span>
            <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px' }} />
          </div>

          <button
            onClick={() => {
              setShowSettings(false);
              onClose?.();
            }}
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '8px',
              background: '#667eea',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            关闭
          </button>
        </div>
      )}
    </div>
  );
}
