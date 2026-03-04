import React, { useEffect, useRef } from 'react';

const StormEffect = () => {
    const canvasRef = useRef(null);
    const audioCtxRef = useRef(null);
    const rainGainRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let width, height;
        const rainCount = 150;
        const rainParticles = [];
        let lightningFlash = 0;
        let lightningStrike = null;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        class Rain {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height - height;
                this.length = Math.random() * 20 + 10;
                this.speed = Math.random() * 10 + 10;
                this.opacity = Math.random() * 0.3 + 0.1;
            }

            update() {
                this.y += this.speed;
                if (this.y > height) {
                    this.reset();
                }
            }

            draw() {
                ctx.strokeStyle = `rgba(34, 197, 94, ${this.opacity})`;
                ctx.lineWidth = 1;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x, this.y + this.length);
                ctx.stroke();

                // Glow effect
                ctx.strokeStyle = `rgba(34, 197, 94, ${this.opacity * 0.5})`;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x, this.y + this.length);
                ctx.stroke();
            }
        }

        const initAudio = () => {
            if (audioCtxRef.current) return;
            console.log('[StormAudio] Initializing synthesis engine...');

            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            audioCtxRef.current = audioCtx;

            // Constant Rain Sound (Pink Noise approximation)
            const bufferSize = 2 * audioCtx.sampleRate;
            const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            let lastOut = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02; // Simple low-pass filter for pinker noise
                lastOut = output[i];
            }

            const noise = audioCtx.createBufferSource();
            noise.buffer = noiseBuffer;
            noise.loop = true;

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 800;

            const rainGain = audioCtx.createGain();
            rainGain.gain.value = 0.03; // Extremely low rain volume
            rainGainRef.current = rainGain;

            noise.connect(filter);
            filter.connect(rainGain);
            rainGain.connect(audioCtx.destination);
            noise.start();
        };

        const playThunder = () => {
            if (!audioCtxRef.current) return;
            const audioCtx = audioCtxRef.current;
            const time = audioCtx.currentTime;

            // Deep Rumble
            const rumbleOsc = audioCtx.createOscillator();
            const rumbleGain = audioCtx.createGain();

            rumbleOsc.type = 'sine';
            rumbleOsc.frequency.setValueAtTime(40, time);
            rumbleOsc.frequency.exponentialRampToValueAtTime(30, time + 2);

            rumbleGain.gain.setValueAtTime(0, time);
            rumbleGain.gain.linearRampToValueAtTime(0.08, time + 0.1); // Quick attack
            rumbleGain.gain.exponentialRampToValueAtTime(0.001, time + 3); // Long decay

            rumbleOsc.connect(rumbleGain);
            rumbleGain.connect(audioCtx.destination);
            rumbleOsc.start(time);
            rumbleOsc.stop(time + 3);

            // Crackle/Snap
            const bufferSize = audioCtx.sampleRate * 0.5;
            const snapBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = snapBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

            const snapSource = audioCtx.createBufferSource();
            snapSource.buffer = snapBuffer;

            const snapFilter = audioCtx.createBiquadFilter();
            snapFilter.type = 'highpass';
            snapFilter.frequency.value = 1500;

            const snapGain = audioCtx.createGain();
            snapGain.gain.setValueAtTime(0.05, time); // Low snap volume
            snapGain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

            snapSource.connect(snapFilter);
            snapFilter.connect(snapGain);
            snapGain.connect(audioCtx.destination);
            snapSource.start(time);
        };

        const init = () => {
            resize();
            for (let i = 0; i < rainCount; i++) {
                rainParticles.push(new Rain());
            }
        };

        const drawLightning = (x, y, segments) => {
            ctx.beginPath();
            ctx.moveTo(x, y);
            let curX = x;
            let curY = y;

            for (let i = 0; i < segments; i++) {
                curX += (Math.random() - 0.5) * 60;
                curY += (Math.random()) * 80;
                ctx.lineTo(curX, curY);
            }

            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#22c55e';
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Random lightning trigger
            if (Math.random() < 0.005 && !lightningStrike) {
                lightningFlash = 10;
                lightningStrike = {
                    x: Math.random() * width,
                    y: 0,
                    segments: Math.floor(Math.random() * 8 + 5)
                };
                playThunder();
            }

            // Draw lightning flash
            if (lightningFlash > 0) {
                ctx.fillStyle = `rgba(34, 197, 94, ${lightningFlash * 0.01})`;
                ctx.fillRect(0, 0, width, height);

                if (lightningStrike) {
                    drawLightning(lightningStrike.x, lightningStrike.y, lightningStrike.segments);
                }

                lightningFlash--;
                if (lightningFlash === 0) lightningStrike = null;
            }

            // Update and draw rain
            rainParticles.forEach(p => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        window.addEventListener('click', initAudio, { once: true }); // Start audio on first interaction
        init();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('click', initAudio);
            cancelAnimationFrame(animationFrameId);
            if (audioCtxRef.current) {
                audioCtxRef.current.close().catch(() => { });
                audioCtxRef.current = null;
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[1]"
            style={{ opacity: 0.6 }}
        />
    );
};

export default StormEffect;
