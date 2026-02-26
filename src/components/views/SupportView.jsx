import React from 'react';
import { LifeBuoy, MessageSquare } from 'lucide-react';

const SupportView = () => (
    <div className="pt-48 pb-32 max-w-7xl mx-auto px-6 min-h-screen">
        <div className="text-center mb-24">
            <h2 className="text-6xl font-black italic text-white uppercase tracking-tighter mb-4">TACTICAL <span className="text-emerald-400">SUPPORT</span></h2>
            <p className="text-white/30 font-bold uppercase tracking-[0.4em] text-[10px]">Direct Response Unit</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 p-12 rounded-[40px] text-center group pointer-events-auto">
                <div className="w-20 h-20 mx-auto bg-emerald-400/10 rounded-[30px] border border-emerald-400/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <LifeBuoy size={40} className="text-emerald-400" />
                </div>
                <h3 className="text-2xl font-black italic text-white uppercase mb-4">Tickets</h3>
                <p className="text-white/30 text-sm mb-10 leading-relaxed font-medium">Standard response time: 2-4 hours.</p>
                <a href="https://metacheat.mysellauth.com/tickets" target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-white hover:text-black transition-all">Open Terminal</a>
            </div>

            <div className="bg-white/5 border border-white/10 p-12 rounded-[40px] text-center group pointer-events-auto">
                <div className="w-20 h-20 mx-auto bg-emerald-400/10 rounded-[30px] border border-emerald-400/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <MessageSquare size={40} className="text-emerald-400" />
                </div>
                <h3 className="text-2xl font-black italic text-white uppercase mb-4">Discord</h3>
                <p className="text-white/30 text-sm mb-10 leading-relaxed font-medium">Live community & community support 24/7.</p>
                <a href="https://discord.gg/metacheats" target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-[#5865F2] text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-[#4752C4] transition-all">Join Comms</a>
            </div>
        </div>
    </div>
);

export default SupportView;
