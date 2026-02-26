import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Zap, Terminal } from 'lucide-react';

const VegaHero = ({ onExplore }) => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#050505]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/vega_hero.png" 
          alt="Vega Background" 
          className="w-full h-full object-cover opacity-40 scale-105 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/40 to-[#050505]" />
        
        {/* Atmospheric Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[150px] rounded-full animate-float" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ x: -100, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center space-x-3 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-10 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400">VEGA PROTOCOL v4.2.0 ACTIVE</span>
            </div>

            <h1 className="text-8xl md:text-[120px] font-black italic text-white uppercase leading-[0.8] tracking-tighter mb-10">
              ELITE <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">TACTICAL</span><br/>
              DOMINANCE
            </h1>

            <p className="text-xl text-white/40 font-medium max-w-lg mb-14 leading-relaxed border-l-2 border-emerald-500/30 pl-8">
              Precision-engineered kernel-mode intelligence for Rainbow Six Siege. Stay ahead of the curve with our silent protocol.
            </p>

            <div className="flex flex-wrap gap-8">
              <button 
                onClick={onExplore}
                className="group relative px-12 py-6 bg-emerald-500 text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white transition-all shadow-[0_0_60px_rgba(16,185,129,0.4)] flex items-center space-x-4 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <span className="relative z-10">Initialize Store</span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform" />
              </button>
              
              <button className="px-10 py-6 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 transition-all flex items-center space-x-4 backdrop-blur-sm">
                <Terminal size={18} className="text-emerald-400" />
                <span>Command Status</span>
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ delay: 0.3, duration: 1 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 bg-gradient-to-br from-white/10 to-transparent p-[1px] rounded-[50px] shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80" 
                alt="Tactical UI" 
                className="rounded-[49px] grayscale contrast-125 opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-[49px]" />
              
              {/* Floating Tech Elements */}
              <div className="absolute top-10 right-10 p-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl animate-float-slow">
                <Zap className="text-emerald-400 mb-2" size={24} />
                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Latency</div>
                <div className="text-xl font-black text-white italic">0.02ms</div>
              </div>
            </div>
            
            {/* Background Glow */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/20 blur-[120px] rounded-full animate-pulse" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VegaHero;
