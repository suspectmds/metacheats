import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, MonitorCheck, RefreshCw, Zap } from 'lucide-react';

const PremiumStatus = () => {
    return (
        <section className="py-32 bg-[#080808] border-y border-white/5 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Temp Spoofer Spotlight */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative p-12 bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[48px] overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-8">
                            <RefreshCw size={100} className="text-emerald-500/5 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
                        </div>

                        <div className="flex items-center space-x-4 mb-10">
                            <div className="p-4 bg-emerald-400 text-black rounded-2xl shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                                <RefreshCw size={24} className="animate-spin-slow" />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-400">Integrated Driver</span>
                        </div>

                        <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-8 leading-tight">
                            BUILT-IN <span className="text-emerald-400">TEMP SPOOFER</span>
                        </h2>

                        <p className="text-white/40 text-lg font-medium leading-relaxed mb-10">
                            Our software includes a proprietary one-click temporary hardware spoofer. Avoid permanent identification and stay undetected on EAC & BattlEye protected systems.
                        </p>

                        <ul className="space-y-4">
                            {["One-Click Injection", "Randomizes Disk/CPU/MAC", "Anti-Cheat Bypassed"].map(item => (
                                <li key={item} className="flex items-center space-x-3 text-sm font-black uppercase tracking-widest text-white/60">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Streamproof Status */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="p-12 bg-white/[0.02] border border-white/10 rounded-[48px] flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center space-x-4 mb-10">
                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl">
                                    <MonitorCheck size={24} />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-400">Streaming Status</span>
                            </div>

                            <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-8 leading-tight">
                                COMPLETELY <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">STREAMPROOF</span>
                            </h2>

                            <p className="text-white/40 text-lg font-medium leading-relaxed mb-10">
                                Visuals are invisible to all recording and streaming software. Capture your gameplay with confidence.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {["OBS", "MEDAL", "DISCORD", "TWITCH"].map(platform => (
                                <div key={platform} className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                    <span className="text-[10px] font-black tracking-widest text-white">{platform}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PremiumStatus;
