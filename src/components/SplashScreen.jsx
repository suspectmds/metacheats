import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onComplete }) => {
    const [loading, setLoading] = useState(0);
    const audioCtxRef = useRef(null);
    const oscRef = useRef(null);
    const gainRef = useRef(null);
    const subRef = useRef(null); // New ref for sub-harmonic oscillator
    const noiseRef = useRef(null); // New ref for noise generator
    const filterRef = useRef(null); // New ref for the primary oscillator's filter

    useEffect(() => {
        // Initialize Audio Context on first loading tick
        const initAudio = () => {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();

                const ctx = audioCtxRef.current;
                const masterGain = ctx.createGain();
                masterGain.connect(ctx.destination);
                masterGain.gain.setValueAtTime(0, ctx.currentTime);
                masterGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.2);
                gainRef.current = masterGain;

                // 1. Primary "Power" Oscillator (Saw/Square mix feel)
                const osc1 = ctx.createOscillator();
                const filter1 = ctx.createBiquadFilter();
                osc1.type = 'sawtooth';
                filter1.type = 'lowpass';
                filter1.frequency.value = 400;
                osc1.connect(filter1);
                filter1.connect(masterGain);
                osc1.start();
                oscRef.current = osc1;

                // 2. Sub-harmonic Layer (Adds "Mass")
                const sub = ctx.createOscillator();
                const subGain = ctx.createGain();
                sub.type = 'sine';
                subGain.gain.value = 0.4;
                sub.connect(subGain);
                subGain.connect(masterGain);
                sub.start();
                subRef.current = sub;

                // 3. Texture Layer (Filtered Noise for "energy" feel)
                const bufferSize = 2 * ctx.sampleRate;
                const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const output = noiseBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    output[i] = Math.random() * 2 - 1;
                }
                const noise = ctx.createBufferSource();
                noise.buffer = noiseBuffer;
                noise.loop = true;
                const noiseFilter = ctx.createBiquadFilter();
                noiseFilter.type = 'bandpass';
                noiseFilter.Q.value = 1;
                const noiseGain = ctx.createGain();
                noiseGain.gain.value = 0.05;
                noise.connect(noiseFilter);
                noiseFilter.connect(noiseGain);
                noiseGain.connect(masterGain);
                noise.start();
                noiseRef.current = { source: noise, filter: noiseFilter, gain: noiseGain };

                filterRef.current = filter1;
            }
        };

        const interval = setInterval(() => {
            setLoading((prev) => {
                if (prev === 0) initAudio();

                const next = Math.min(prev + 1.5, 100);

                // --- Real-time Audio Sync ---
                if (audioCtxRef.current && gainRef.current) {
                    const ctx = audioCtxRef.current;
                    const time = ctx.currentTime + 0.05;
                    const progress = next / 100;

                    // Sync Frequencies
                    if (oscRef.current) {
                        const baseFreq = 50 + (progress * 250); // 50 -> 300Hz
                        oscRef.current.frequency.exponentialRampToValueAtTime(baseFreq, time);
                        if (subRef.current) {
                            subRef.current.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, time);
                        }
                    }

                    // Sync Filter & Energy
                    if (filterRef.current) {
                        const filterFreq = 200 + (progress * 1800); // 200 -> 2000Hz
                        filterRef.current.frequency.exponentialRampToValueAtTime(filterFreq, time);
                        filterRef.current.Q.exponentialRampToValueAtTime(1 + (progress * 12), time);
                    }

                    // Sync Noise Energy
                    if (noiseRef.current) {
                        noiseRef.current.filter.frequency.exponentialRampToValueAtTime(500 + (progress * 3000), time);
                        noiseRef.current.gain.gain.linearRampToValueAtTime(0.02 + (progress * 0.08), time);
                    }
                }

                if (next >= 100) {
                    clearInterval(interval);

                    if (gainRef.current && audioCtxRef.current) {
                        const ctx = audioCtxRef.current;
                        gainRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);

                        // Victory / Completion Chime (Tiered)
                        [880, 1320, 1760].forEach((f, i) => {
                            const chime = ctx.createOscillator();
                            const cGain = ctx.createGain();
                            chime.type = 'sine';
                            chime.frequency.setValueAtTime(f, ctx.currentTime + 0.1);
                            cGain.gain.setValueAtTime(0.1, ctx.currentTime + 0.1);
                            cGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6 + (i * 0.2));
                            chime.connect(cGain);
                            cGain.connect(ctx.destination);
                            chime.start(ctx.currentTime + 0.1);
                            chime.stop(ctx.currentTime + 0.9 + (i * 0.2));
                        });
                    }

                    setTimeout(onComplete, 1400);
                    return 100;
                }
                return next;
            });
        }, 30);

        return () => {
            clearInterval(interval);
            [oscRef, subRef].forEach(ref => {
                if (ref.current) {
                    try { ref.current.stop(); ref.current.disconnect(); } catch (e) { }
                }
            });
            if (noiseRef.current) {
                try { noiseRef.current.source.stop(); noiseRef.current.source.disconnect(); } catch (e) { }
            }
            if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
                audioCtxRef.current.close().catch(() => { });
            }
        };
    }, [onComplete]);

    // SVG Progress Ring Constants
    const radius = 170; // Increased radius to make it "wider out"
    const circumference = 2 * Math.PI * radius;

    // LED Green Glow Styles
    const ledGreenGlow = {
        filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.9)) drop-shadow(0 0 20px rgba(34, 197, 94, 0.5))',
        color: '#22c55e'
    };

    const ledTextGlow = {
        textShadow: '0 0 12px rgba(34, 197, 94, 0.9), 0 0 25px rgba(34, 197, 94, 0.4)',
        color: '#22c55e'
    };

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-[100] bg-[#08080A] flex flex-col items-center justify-center p-6 overflow-hidden"
        >
            <style>
                {`
          @keyframes pulse-inner-glow {
            0% { box-shadow: inset 0 0 20px rgba(34, 197, 94, 0.2), 0 0 10px rgba(34, 197, 94, 0.1); scale: 1; }
            50% { box-shadow: inset 0 0 60px rgba(34, 197, 94, 0.6), 0 0 40px rgba(34, 197, 94, 0.3); scale: 1.02; }
            100% { box-shadow: inset 0 0 20px rgba(34, 197, 94, 0.2), 0 0 10px rgba(34, 197, 94, 0.1); scale: 1; }
          }
          @keyframes gradient-move {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .glass-square {
            background: rgba(10, 10, 11, 0.85);
            backdrop-filter: blur(25px);
            border: 1px solid rgba(34, 197, 94, 0.25);
          }
        `}
            </style>

            {/* Abstract Background Elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative mb-32 z-10 flex items-center justify-center">
                {/* Outer Synchronized Ring - Expanded Viewport to 600px to prevent clipping */}
                <svg className="absolute w-[600px] h-[600px] -rotate-90 pointer-events-none overflow-visible">
                    <defs>
                        <linearGradient id="ledGradientV2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="50%" stopColor="#22c55e" />
                            <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                        <filter id="ledGlowHeavy" x="-100%" y="-100%" width="300%" height="300%">
                            <feGaussianBlur stdDeviation="8" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Track */}
                    <circle
                        cx="300"
                        cy="300"
                        r={radius}
                        fill="transparent"
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeWidth="3"
                    />

                    {/* Active Ring */}
                    <motion.circle
                        cx="300"
                        cy="300"
                        r={radius}
                        fill="transparent"
                        stroke="url(#ledGradientV2)"
                        strokeWidth="5"
                        strokeDasharray={circumference}
                        animate={{ strokeDashoffset: circumference - (loading / 100) * circumference }}
                        transition={{ duration: 0.1, ease: "linear" }}
                        strokeLinecap="round"
                        style={{ filter: 'url(#ledGlowHeavy)' }}
                    />
                </svg>

                {/* Square Logo Container (Inside-Out Glow) */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="w-44 h-44 md:w-60 md:h-60 glass-square rounded-[2.5rem] flex items-center justify-center p-10 relative overflow-hidden group shadow-2xl z-20"
                    style={{
                        animation: 'pulse-inner-glow 4s infinite ease-in-out'
                    }}
                >
                    {/* Internal Expanding Glow Layer */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />

                    {/* The Logo Image */}
                    <div className="w-full h-full flex items-center justify-center relative z-10">
                        <img
                            src="/logo.png"
                            alt="Meta Cheats Logo"
                            className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(34, 197, 94, 0.8)]"
                        />
                    </div>

                    {/* Scanning Beam */}
                    <motion.div
                        animate={{ top: ['-100%', '200%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-20 bg-gradient-to-b from-transparent via-accent/10 to-transparent z-20 pointer-events-none"
                    />
                </motion.div>
            </div>

            <div className="w-full max-w-[360px] relative z-10 mt-8">
                <div className="flex justify-between items-end mb-6">
                    <div className="flex flex-col">
                        <span className="text-base font-black uppercase tracking-[0.6em] mb-1 transition-all duration-300" style={ledTextGlow}>
                            Meta Cheats
                        </span>
                        <span className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] opacity-60">Initializing Secure Stream...</span>
                    </div>
                    <span className="text-4xl font-black italic text-white tabular-nums tracking-tighter" style={ledTextGlow}>{loading}%</span>
                </div>

                {/* Synchronized LED Progress Bar */}
                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5 shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${loading}%` }}
                        className="h-full bg-gradient-to-r from-accent via-brandPurple to-white rounded-full"
                        style={{
                            backgroundSize: '200% 200%',
                            animation: 'gradient-move 2s infinite linear',
                            boxShadow: '0 0 25px rgba(34, 197, 94, 0.7)'
                        }}
                    />
                </div>
            </div>

            {/* Connection Protocol Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-12 flex flex-col items-center gap-2"
            >
                <div className="flex items-center gap-4 px-8 py-4 glass rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_12px_rgba(34, 197, 94, 1)]" />
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/60">Secure Handshake: V2X Protocol</span>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SplashScreen;
