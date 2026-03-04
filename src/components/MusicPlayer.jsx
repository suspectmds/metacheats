import React, { useState, useEffect, useRef } from 'react';
import { Music2, Volume2, VolumeX, ChevronUp, ChevronDown } from 'lucide-react';

const VIDEO_ID = 'mzB1VGEGcSU'; // Juice WRLD - Lucid Dreams
const TRACK_LABEL = 'Juice WRLD - Lucid Dreams';

const MusicPlayer = () => {
    const playerRef = useRef(null);
    const containerRef = useRef(null);
    const [ready, setReady] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(40);
    const [muted, setMuted] = useState(false);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        // Load YouTube IFrame API once
        if (window.YT && window.YT.Player) {
            initPlayer();
            return;
        }

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);

        window.onYouTubeIframeAPIReady = initPlayer;
        return () => { window.onYouTubeIframeAPIReady = null; };
    }, []);

    const initPlayer = () => {
        if (playerRef.current) return; // already inited
        playerRef.current = new window.YT.Player(containerRef.current, {
            videoId: VIDEO_ID,
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                loop: 1,
                playlist: VIDEO_ID,
                modestbranding: 1,
                rel: 0,
            },
            events: {
                onReady: (e) => {
                    e.target.setVolume(40);
                    setReady(true);
                },
                onStateChange: (e) => {
                    setPlaying(e.data === window.YT.PlayerState.PLAYING);
                },
            },
        });
    };

    const toggle = () => {
        if (!playerRef.current || !ready) return;
        const state = playerRef.current.getPlayerState();
        if (state === window.YT.PlayerState.PLAYING) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

    const handleVolume = (e) => {
        const v = parseInt(e.target.value);
        setVolume(v);
        setMuted(v === 0);
        if (playerRef.current && ready) {
            playerRef.current.setVolume(v);
            if (v === 0) playerRef.current.mute();
            else playerRef.current.unMute();
        }
    };

    const handleMute = () => {
        if (!playerRef.current || !ready) return;
        if (muted) {
            playerRef.current.unMute();
            playerRef.current.setVolume(volume);
            setMuted(false);
        } else {
            playerRef.current.mute();
            setMuted(true);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
            {/* Hidden YouTube player iframe */}
            <div
                ref={containerRef}
                style={{ width: 0, height: 0, overflow: 'hidden', position: 'absolute', pointerEvents: 'none' }}
            />

            <div style={{
                background: 'rgba(10,10,10,0.85)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${playing ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: playing
                    ? '0 0 30px rgba(34,197,94,0.2), 0 8px 32px rgba(0,0,0,0.5)'
                    : '0 8px 32px rgba(0,0,0,0.4)',
                transition: 'all 0.4s',
                minWidth: '210px',
            }}>
                {/* Header bar */}
                <div
                    onClick={() => setExpanded(!expanded)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 14px', cursor: 'pointer', userSelect: 'none',
                    }}
                >
                    <Music2
                        size={14}
                        style={{
                            color: '#22c55e', flexShrink: 0,
                            animation: playing ? 'musicSpin 3s linear infinite' : 'none',
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontSize: '10px', fontWeight: 900, textTransform: 'uppercase',
                            letterSpacing: '0.12em', color: '#fff',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '130px',
                        }}>
                            {TRACK_LABEL}
                        </div>
                        <div style={{ fontSize: '9px', color: playing ? '#22c55e' : 'rgba(255,255,255,0.35)', fontWeight: 700, transition: 'color 0.3s' }}>
                            {!ready ? 'loading...' : playing ? '▶ playing' : '⏸ paused'}
                        </div>
                    </div>
                    {expanded
                        ? <ChevronDown size={12} style={{ color: 'rgba(255,255,255,0.35)' }} />
                        : <ChevronUp size={12} style={{ color: 'rgba(255,255,255,0.35)' }} />
                    }
                </div>

                {/* Expanded controls */}
                {expanded && (
                    <div style={{
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        padding: '12px 14px',
                        display: 'flex', flexDirection: 'column', gap: '10px',
                    }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={toggle}
                                disabled={!ready}
                                style={{
                                    flex: 1, padding: '7px 0',
                                    background: playing ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                                    border: `1px solid ${playing ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.1)'}`,
                                    borderRadius: '8px',
                                    color: playing ? '#22c55e' : '#fff',
                                    fontSize: '10px', fontWeight: 900,
                                    textTransform: 'uppercase', letterSpacing: '0.12em',
                                    cursor: ready ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.2s',
                                    opacity: ready ? 1 : 0.5,
                                }}
                            >
                                {playing ? '⏸ Pause' : '▶ Play'}
                            </button>
                            <button
                                onClick={handleMute}
                                style={{
                                    padding: '7px 10px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'rgba(255,255,255,0.6)',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                                }}
                            >
                                {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                            </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Volume2 size={10} style={{ color: 'rgba(255,255,255,0.3)' }} />
                            <input
                                type="range" min="0" max="100" step="1"
                                value={muted ? 0 : volume}
                                onChange={handleVolume}
                                style={{ flex: 1, accentColor: '#22c55e', cursor: 'pointer' }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes musicSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default MusicPlayer;
