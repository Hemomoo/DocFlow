'use client';

import React from 'react';
import {
  useTracks,
  TrackReferenceOrPlaceholder,
  useRoomContext,
  useLocalParticipant,
} from '@livekit/components-react';
import type { Track } from 'livekit-client';

export function VideoConferenceLayout() {
  const room = useRoomContext();
  const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare], {
    onlySubscribed: false,
  });
  const { localParticipant } = useLocalParticipant();

  const gridStyle = React.useMemo(() => {
    const count = tracks.length;

    if (count === 1) {
      return { gridTemplateColumns: '1fr' };
    } else if (count === 2) {
      return { gridTemplateColumns: 'repeat(2, 1fr)' };
    } else if (count <= 4) {
      return { gridTemplateColumns: 'repeat(2, 1fr)' };
    } else {
      return { gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' };
    }
  }, [tracks.length]);

  return (
    <div
      className="lk-video-grid"
      style={{
        height: '100%',
        display: 'grid',
        gap: '8px',
        padding: '8px',
        ...gridStyle,
      }}
    >
      {tracks.map((trackRef) => (
        <ParticipantTile key={trackRef.participant.identity} trackRef={trackRef} />
      ))}
    </div>
  );
}

function ParticipantTile({ trackRef }: { trackRef: TrackReferenceOrPlaceholder }) {
  const { track, participant } = trackRef;
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (track && videoRef.current) {
      track.attach(videoRef.current);

      return () => {
        track.detach(videoRef.current);
      };
    }
  }, [track]);

  return (
    <div
      style={{
        position: 'relative',
        background: '#1a1a1a',
        borderRadius: '8px',
        overflow: 'hidden',
        aspectRatio: '16/9',
      }}
    >
      {track ? (
        <video
          ref={videoRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          autoPlay
          playsInline
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <span style={{ fontSize: '3rem' }}>👤</span>
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          background: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '500',
        }}
      >
        {participant.name || participant.identity}
      </div>
    </div>
  );
}
