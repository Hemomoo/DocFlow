'use client';

import React from 'react';

interface ShareRoomButtonProps {
  roomName: string;
  userName: string;
  onClose?: () => void;
}

export function ShareRoomButton({ roomName, userName, onClose }: ShareRoomButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/dashboard/videoCall?room=${roomName}`
      : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '加入我的视频会议',
          text: `你好，${userName} 邀请你加入视频会议`,
          url: shareUrl,
        });
      } catch (err) {
        console.log('分享失败:', err);
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#1a1a1a',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '600', color: 'white' }}>
          分享房间
        </h2>

        <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#999' }}>
          分享以下链接邀请他人加入会议
        </p>

        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px',
          }}
        >
          <input
            type="text"
            value={shareUrl}
            readOnly
            style={{
              flex: 1,
              padding: '10px 12px',
              background: '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '6px',
              color: '#999',
              fontSize: '13px',
            }}
          />
          <button
            onClick={handleCopyLink}
            style={{
              padding: '10px 16px',
              background: copied ? '#4ade80' : '#667eea',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
            }}
          >
            {copied ? '已复制' : '复制'}
          </button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#999' }}>房间号</p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              background: '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '6px',
            }}
          >
            <span
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                letterSpacing: '0.1em',
              }}
            >
              {roomName}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(roomName);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              style={{
                marginLeft: 'auto',
                padding: '6px 10px',
                background: 'transparent',
                border: '1px solid #444',
                borderRadius: '4px',
                color: '#999',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              复制
            </button>
          </div>
        </div>

        {navigator.share && (
          <button
            onClick={handleNativeShare}
            style={{
              width: '100%',
              padding: '12px',
              background: '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            使用系统分享
          </button>
        )}

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            background: 'transparent',
            border: 'none',
            borderRadius: '6px',
            color: '#999',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          关闭
        </button>
      </div>
    </div>
  );
}
