import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const StatusView = ({ liveGames }) => {
    const filteredGames = (liveGames || []).filter(g =>
        g.name.toLowerCase().includes('external') ||
        g.name.toLowerCase().includes('internal') ||
        g.name.toLowerCase().includes('cheat') ||
        g.name.toLowerCase().includes('spoofer') ||
        g.name.toLowerCase().includes('service')
    ).filter(g => !g.name.toLowerCase().includes('account') && !g.name.toLowerCase().includes('gen'));

    return (
        <div className="pt-48 pb-32 max-w-7xl mx-auto px-6 min-h-screen">
            <div className="text-center mb-24">
                <h2 className="text-6xl font-black italic text-white uppercase tracking-tighter mb-4">SYSTEM <span className="text-emerald-400">STATUS</span></h2>
                <p className="text-white/30 font-bold uppercase tracking-[0.4em] text-[10px]">Real-time Network Diagnostics</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredGames.map((game) => (
                    <div key={game.id} className="bg-white/5 border border-white/10 p-8 rounded-[32px] flex items-center justify-between pointer-events-auto">
                        <div className="flex items-center space-x-8">
                            <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center">
                                <Zap size={20} className="text-emerald-400" />
                            </div>
                            <div>
                                <div className="text-xl font-black italic text-white uppercase tracking-tighter">{game.name}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Operational Sector</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="px-5 py-2 bg-emerald-400/10 border border-emerald-400/20 rounded-full flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Stable</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatusView;
