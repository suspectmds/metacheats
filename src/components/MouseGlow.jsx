import React, { useState, useEffect } from 'react';

const MouseGlow = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            className="pointer-events-none fixed inset-0 z-[99]"
            style={{
                background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.12), transparent 80%)`
            }}
        />
    );
};

export default MouseGlow;
