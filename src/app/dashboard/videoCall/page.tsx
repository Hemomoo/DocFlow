'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RoomContext } from '@livekit/components-react';
import {
  Room,
  RoomOptions,
  VideoPresets,
  TrackPublishDefaults,
  VideoCaptureOptions,
  RoomConnectOptions,
  RoomEvent,
} from 'livekit-client';
import { AlertCircle } from 'lucide-react';

import {
  CustomControlBar,
  VideoConferenceLayout,
  KeyboardShortcuts,
  SettingsMenu,
  ShareRoomButton,
  PreJoinScreen,
} from '@/components/video';
import { LivekitService } from '@/services/livekit';

export default function VideoCallPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const roomParam = searchParams.get('room');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleCreateRoom = async (data: any) => {
    try {
      setIsCreating(true);
      setError(null);

      const connection = await LivekitService.createRoom({
        maxParticipants: data.maxParticipants || 20,
        emptyTimeout: data.emptyTimeout || 300,
        metadata: data.metadata,
      });

      setConnectionDetails(connection);
    } catch (err: any) {
      console.error('Failed to create room:', err);
      setError(err.message || 'Failed to create room');
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async (roomName: string, data: any) => {
    try {
      setIsJoining(true);
      setError(null);

      const connection = await joinRoom(roomName);

      setConnectionDetails(connection);
    } catch (err: any) {
      console.error('Failed to join room:', err);
      setError(err.message || 'Failed to join room');
      setIsJoining(false);
    }
  };

  const handleBack = () => {
    setError(null);
    setIsCreating(false);
    setIsJoining(false);
  };

  if (error) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">操作失败</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              返回
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!connectionDetails) {
    return (
      <PreJoinScreen
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        isCreating={isCreating}
        isJoining={isJoining}
      />
    );
  }

  return (
    <VideoConferenceComponent
      connectionDetails={connectionDetails}
      onShareClick={() => setShowShareDialog(true)}
      showSettings={showSettings}
      setShowSettings={setShowSettings}
    />
  );
}

function VideoConferenceComponent({
  connectionDetails,
  onShareClick,
  showSettings,
  setShowSettings,
}: {
  connectionDetails: any;
  onShareClick: () => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}) {
  const room = React.useMemo(() => new Room(), []);

  const roomOptions: RoomOptions = React.useMemo(() => {
    const videoCaptureDefaults: VideoCaptureOptions = {
      resolution: VideoPresets.h720,
    };
    const publishDefaults: TrackPublishDefaults = {
      dtx: false,
      videoSimulcastLayers: [VideoPresets.h540, VideoPresets.h216],
      red: true,
    };

    return {
      videoCaptureDefaults,
      publishDefaults,
      audioCaptureDefaults: {},
      adaptiveStream: true,
      dynacast: true,
      singlePeerConnection: true,
    };
  }, []);

  const connectOptions: RoomConnectOptions = React.useMemo(() => {
    return {
      autoSubscribe: true,
    };
  }, []);

  const router = useRouter();

  React.useEffect(() => {
    room.on(RoomEvent.Disconnected, () => {
      router.push('/dashboard');
    });

    room
      .connect(connectionDetails.url, connectionDetails.token, connectOptions)
      .then(() => {
        console.log('Connected to room:', connectionDetails.roomName);
        room.localParticipant.setCameraEnabled(true).catch((error) => {
          console.warn('Camera not available:', error.message);
        });
        room.localParticipant.setMicrophoneEnabled(true).catch((error) => {
          console.warn('Microphone not available:', error.message);
        });
      })
      .catch((error) => {
        console.error('Connection error:', error);
      });

    return () => {
      room.disconnect();
    };
  }, [room, connectionDetails, connectOptions, router]);

  return (
    <div className="lk-room-container h-screen bg-gray-900 flex flex-col" data-lk-theme="default">
      <RoomContext.Provider value={room}>
        <KeyboardShortcuts />

        <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-white font-semibold text-lg">视频会议</h1>
            <div className="flex items-center gap-2 bg-gray-700 px-3 py-1.5 rounded-lg">
              <span className="text-gray-400 text-sm">房间号:</span>
              <span className="text-white font-mono text-sm">{connectionDetails.roomName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onShareClick}
              className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              title="分享房间"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              title="设置"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <VideoConferenceLayout />
        </div>

        <div className="bg-gray-800 border-t border-gray-700">
          <CustomControlBar roomName={connectionDetails.roomName} onShareClick={onShareClick} />
        </div>

        {showShareDialog && (
          <ShareRoomButton
            roomName={connectionDetails.roomName}
            userName={connectionDetails.userName || 'User'}
            onClose={() => setShowShareDialog(false)}
          />
        )}

        {showSettings && (
          <div className="absolute bottom-20 right-4 z-50">
            <SettingsMenu onClose={() => setShowSettings(false)} />
          </div>
        )}
      </RoomContext.Provider>
    </div>
  );
}
