'use client';

import React from 'react';
import {
  //   useRoomContext,
  TrackToggle,
  ChatToggle,
  DisconnectButton,
  //   useLocalParticipant,
} from '@livekit/components-react';
import { Track } from 'livekit-client';

interface CustomControlBarProps {
  roomName: string;
  onShareClick?: () => void;
}

export function CustomControlBar({ roomName, onShareClick }: CustomControlBarProps) {
  //   const room = useRoomContext();
  //   const { localParticipant } = useLocalParticipant();
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(roomName).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });

    if (onShareClick) {
      onShareClick();
    }
  };

  return (
    <div className="lk-control-bar">
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
        }}
      >
        <TrackToggle source={Track.Source.Microphone} showIcon={true} />
        <TrackToggle source={Track.Source.Camera} showIcon={true} />
        <TrackToggle source={Track.Source.ScreenShare} showIcon={true} />
        <ChatToggle />
        <button
          onClick={handleShare}
          className="lk-button lk-button-menu"
          aria-label="分享房间"
          title={copied ? '✓ 已复制房间号！' : '点击复制房间号'}
          style={{
            position: 'relative',
            background: copied ? 'rgba(74, 222, 128, 0.2)' : undefined,
            color: copied ? '#4ade80' : undefined,
          }}
        >
          {copied ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
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
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          )}
        </button>
        <DisconnectButton />
      </div>
    </div>
  );
}
