import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const AccountsView = ({ getAccountGroups, setSelectedGroup, setView }) => (
    <motion.div key="accounts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-48 pb-32 max-w-7xl mx-auto px-6 min-h-screen">
        <div className="text-center mb-24">
            <h2 className="text-7xl font-black italic text-white uppercase tracking-tighter mb-4">PREMIUM <span className="text-emerald-400">ACCOUNTS</span></h2>
            <p className="text-white/30 font-bold uppercase tracking-[0.4em] text-[10px]">Aged, Ranked & Ready for Deployment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getAccountGroups().map((group) => (
                <div
                    key={group.id}
                    onClick={() => { setSelectedGroup(group); setView('Group'); }}
                    className="group relative h-[450px] rounded-[40px] overflow-hidden cursor-pointer border border-white/10 hover:border-emerald-500/30 transition-all pointer-events-auto"
                >
                    <img src={group.image_url} alt={group.name} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute top-8 right-8">
                        <div className="px-5 py-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest">Instant Delivery</div>
                    </div>
                    <div className="absolute bottom-10 left-10 p-2">
                        <div className="text-3xl font-black italic text-white uppercase tracking-tighter mb-2 group-hover:text-emerald-400 transition-colors">{group.name}</div>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-6">Explore Inventory</p>
                        <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                            <ArrowRight size={18} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
);

export default AccountsView;
