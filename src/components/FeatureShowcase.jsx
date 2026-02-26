import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Settings, Zap, Target, Crosshair } from 'lucide-react';

const FeatureShowcase = () => {
    const features = [
        {
            title: "R6 AIMBOT",
            desc: "Advanced predictive algorithm with skeleton priority and custom smoothing. Completely humanized input emulation.",
            icon: <Crosshair className="text-emerald-400" size={32} />,
            details: ["Kernel Level", "Memory Safe", "Custom FOV"]
        },
        {
            title: "VISUALS & ESP",
            desc: "Precision skeleton ESP with head markers and distance checks. Clean, informative HUD with no performance impact.",
            icon: <Eye className="text-blue-400" size={32} />,
            details: ["Skeleton", "Box ESP", "Line of Sight"]
        },
        {
            title: "SYSTEM MISC",
            desc: "Essential utility tools including recoil compensation, spread control, and custom configuration management.",
            icon: <Settings className="text-purple-400" size={32} />,
            details: ["No Recoil", "Profile Save", "Config Sync"]
        }
    ];

    return (
        <section className="py-32 bg-[#050505] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-emerald-500 mb-6 font-mono">SPECIFICATION // 001</h3>
                        <h2 className="text-6xl font-black italic text-white uppercase tracking-tighter leading-none">
                            SUBSYSTEM <span className="text-emerald-400">MODULES</span>
                        </h2>
                    </div>
                    <p className="text-white/30 text-sm font-medium max-w-sm font-mono uppercase tracking-widest text-right">
                        Redefining competitive standards through architectural excellence.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="group bg-white/[0.03] border border-white/10 p-12 rounded-[40px] hover:bg-white/[0.05] hover:border-emerald-500/30 transition-all duration-500"
                        >
                            <div className="w-20 h-20 bg-black/40 rounded-3xl flex items-center justify-center mb-12 border border-white/5 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                                {f.icon}
                            </div>
                            <h3 className="text-2xl font-black italic text-white uppercase mb-6 tracking-tight group-hover:text-emerald-400 transition-colors">
                                {f.title}
                            </h3>
                            <p className="text-white/40 text-sm leading-relaxed mb-10 font-medium">
                                {f.desc}
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {f.details.map(d => (
                                    <span key={d} className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors">
                                        {d}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Decorative Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #34d399 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </section>
    );
};

export default FeatureShowcase;
