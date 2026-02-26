import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, ChevronRight } from 'lucide-react';

const GroupView = ({ selectedGroup, getAccountGroups, setView, viewProduct }) => (
    <div className="pt-48 pb-32 max-w-7xl mx-auto px-6">
        <div className="flex items-center space-x-4 mb-8">
            <button onClick={() => setView(getAccountGroups().find(g => g.id === selectedGroup?.id) ? 'Accounts' : 'Home')} className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-white transition-colors pointer-events-auto"><ArrowLeft size={16} /></button>
            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Sector Index</div>
        </div>
        <h2 className="text-6xl font-black italic text-white uppercase tracking-tighter mb-16">{selectedGroup?.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(selectedGroup?.products || []).map((p) => (
                <div key={p.id} onClick={() => viewProduct(p)} className="group bg-white/5 border border-white/10 rounded-[32px] p-8 hover:bg-white/10 transition-all cursor-pointer pointer-events-auto overflow-hidden">
                    <div className="relative h-48 -mx-8 -mt-8 mb-10 overflow-hidden bg-black/40 border-b border-white/5">
                        <img
                            src={p.images?.[0]?.url || p.image_url || p.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80"}
                            alt={p.name}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 opacity-50 group-hover:opacity-100 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    </div>
                    <div className="flex justify-between items-start mb-10">
                        <div className="p-4 bg-emerald-400/10 rounded-2xl border border-emerald-400/20">
                            <Shield size={24} className="text-emerald-400" />
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-1">Starting from</div>
                            <div className="text-2xl font-black italic text-white uppercase tracking-tighter">${p.price_formatted || p.price}</div>
                        </div>
                    </div>
                    <h3 className="text-xl font-black italic text-white uppercase mb-4 tracking-tight group-hover:text-emerald-400 transition-colors">{p.name}</h3>
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-6 border-l border-emerald-400/20 pl-4">Ready for Injection</p>

                    <div className="text-white/40 text-xs leading-relaxed mb-8 line-clamp-3 h-12 overflow-hidden" dangerouslySetInnerHTML={{ __html: p.description || 'No description provided.' }} />

                    <div className="flex items-center justify-between pointer-events-none mt-auto">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Deploy Module</span>
                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                            <ChevronRight size={14} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default GroupView;
