import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Activity, ChevronRight } from 'lucide-react';
import VegaHero from '../VegaHero';
import FeatureShowcase from '../FeatureShowcase';
import PremiumStatus from '../PremiumStatus';

const HomeView = ({ setView, getCheatGroups, setSelectedGroup }) => (
    <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <VegaHero onExplore={() => {
            const el = document.getElementById('store');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }} />

        <FeatureShowcase />

        <PremiumStatus />

        {/* Categories */}
        <section id="store" className="py-24 bg-white/[0.02] border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-4">Operations</h3>
                        <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">SELECT <span className="text-emerald-400">TICKET</span></h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {getCheatGroups().map((group) => (
                        <div
                            key={group.id}
                            onClick={() => { setSelectedGroup(group); setView('Group'); }}
                            className="group relative h-[500px] rounded-[40px] overflow-hidden cursor-pointer border border-white/5 hover:border-emerald-500/30 transition-all pointer-events-auto"
                        >
                            <img
                                src={group.image?.url || group.image_url || group.image || "https://images.unsplash.com/photo-1614332288102-73a50eaa5035?auto=format&fit=crop&w=800&q=80"}
                                alt={group.name}
                                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-40 group-hover:opacity-70"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                            <div className="absolute bottom-10 left-10 p-2">
                                <div className="text-3xl font-black italic text-white uppercase tracking-tighter mb-4 group-hover:text-emerald-400 transition-colors">
                                    {group.name?.toUpperCase() === 'SPOOFER' ? 'WOOFER SPOOFER' : group.name}
                                </div>
                                <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">View Collection</span>
                                    <div className="p-2 bg-white text-black rounded-full"><ArrowRight size={14} /></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Latest Intelligence Section (News) */}
        <section className="py-32 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <h2 className="text-6xl font-black italic text-white uppercase tracking-tighter mb-4">LATEST <span className="text-emerald-400">INTELLIGENCE</span></h2>
                    <p className="text-white/30 font-bold uppercase tracking-[0.3em] text-[10px]">Real-time operational updates and security briefings</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { tag: "SECURITY", title: "v4.2.0 KERNEL UPDATE", desc: "Redesigned injection vector for enhanced Ring-0 stability.", date: "Today" },
                        { tag: "STATUS", title: "EAC BYPASS STABLE", desc: "New polymorphism layer deployed for CS2 and APEX modules.", date: "2 Hours Ago" },
                        { tag: "RESTOCK", title: "AGED STEAM ACCOUNTS", desc: "Batch of 10-year veteran accounts now live in the store.", date: "Yesterday" }
                    ].map((news, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[40px] hover:bg-white/10 transition-all group pointer-events-auto">
                            <div className="flex justify-between items-start mb-12">
                                <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[9px] font-black uppercase tracking-widest">{news.tag}</span>
                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{news.date}</span>
                            </div>
                            <h3 className="text-xl font-black italic text-white uppercase mb-4 group-hover:text-emerald-400 transition-colors tracking-tight">{news.title}</h3>
                            <p className="text-white/40 text-sm leading-relaxed mb-10 font-medium">{news.desc}</p>
                            <div className="flex items-center space-x-3 text-[10px] font-black text-white/20 uppercase tracking-widest">
                                <span>Read Briefing</span>
                                <ChevronRight size={14} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    </motion.div>
);

export default HomeView;
