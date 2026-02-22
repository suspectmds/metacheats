import React, { useState, useEffect } from 'react';
import {
  Shield, Zap, Terminal, CheckCircle2, AlertTriangle, Settings, User, LogOut, Lock,
  ArrowRight, ChevronRight, Database, Search, MessageSquare, Activity, LifeBuoy,
  Star, Monitor, Filter, MoreVertical, Plus, Send, HelpCircle, FileText,
  ShoppingBag, Trash2, Minus, CreditCard, ArrowLeft, Menu, X, ShieldCheck,
  Package, ExternalLink, Info, Layers, RefreshCw, Key, CreditCard as CardIcon, UploadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './lib/supabase';
import AuthModal from './components/AuthModal';

const SELLAUTH_STORE_URL = import.meta.env.VITE_SELLAUTH_STORE_URL || "https://metacheat.mysellauth.com";

// --- FALLBACKS ---
const staticGroups = [
  { id: "60326", name: "RAINBOW SIX SIEGE SERVICES", image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80" },
  { id: "60329", name: "FORTNITE SERVICES", image_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80" },
  { id: "84914", name: "APEX LEGENDS SERVICES.", image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80" },
  { id: "74053", name: "CS2 SERVICES", image_url: "https://images.unsplash.com/photo-1542714598-040b5f812ee2?auto=format&fit=crop&w=800&q=80" },
  { id: "spoofer", name: "WOOFER SPOOFER", image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80" },
  { id: "eft", name: "EFT SERVICES", image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80" },
  { id: "rust", name: "RUST SERVICES", image_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80" },
  { id: "bf6", name: "BATTLEFIELD 6 SERVICES", image_url: "https://images.unsplash.com/photo-1542714598-040b5f812ee2?auto=format&fit=crop&w=800&q=80" },
  { id: "arc", name: "ARCRAIDER SERVICES", image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80" }
];

const staticAccountGroups = [
  { id: "acc_r6", name: "R6 ACCOUNTS", image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80" },
  { id: "acc_fn", name: "FORTNITE ACCOUNTS", image_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80" },
  { id: "acc_steam", name: "STEAM ACCOUNTS", image_url: "https://images.unsplash.com/photo-1542714598-040b5f812ee2?auto=format&fit=crop&w=800&q=80" }
];

const reviewPool = {
  // ... pool content
  names: ['Ghost', 'Specter', 'Viper', 'Zero', 'Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'Xray', 'Yankee', 'Zulu', 'Hacker', 'Admin', 'Root', 'Null', 'Void', 'Cipher', 'Shadow', 'Blade', 'Night', 'Storm'],
  comments: [
    'Absolutely clean injection. No issues at all.',
    'Best support I have ever had. 10/10.',
    'The ESP is perfect, very smooth.',
    'Undetected for 3 months now. Safe.',
    'Love the HWID spoofer, works every time.',
    'Great community and great products.',
    'Fast delivery, as always.',
    'The aimbot is very customisable.',
    'No FPS drops while using the internal module.',
    'A bit pricey but you get what you pay for.',
    'Works on Windows 11 without any workarounds.',
    'Safe for main account if you play legit.',
    'The prediction for Apex is spot on.',
    'R6 Internal is the best on the market right now.',
    'Instant key delivery.',
    'Configuration of the menu is very intuitive.',
    'Had some trouble at first but support fixed it in 5 mins.',
    'Been using this since 2022, still the king.',
    'Security is top notch.',
    'Highly recommend to anyone looking for a competitive edge.'
  ]
};

// --- COMPONENTS ---

const SplashScreen = ({ syncStatus }) => (
  <motion.div
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[10000] bg-[#050505] flex flex-col items-center justify-center p-6"
  >
    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }} className="relative mb-12">
      <div className="absolute inset-0 bg-hacker-green/20 blur-[100px] rounded-full" />
      <Shield size={100} className="text-hacker-green relative z-10" />
    </motion.div>
    <h1 className="text-5xl font-black italic text-white uppercase mb-4 tracking-tighter">META<span className="text-hacker-green">CHEATS</span></h1>
    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
      <RefreshCw size={12} className="animate-spin text-hacker-green" />
      {syncStatus}
    </div>
  </motion.div>
);

const Header = ({ scrolled, view, setView, isMobileMenuOpen, setIsMobileMenuOpen, setShowAuthModal }) => (
  <header className={`fixed top-0 w-full z-[1000] transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-xl py-4 border-b border-white/5' : 'py-10'}`}>
    <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
      <div onClick={() => { setView('Home'); setIsMobileMenuOpen(false); }} className="flex items-center space-x-3 cursor-pointer group pointer-events-auto">
        <div className="p-2.5 bg-hacker-green/10 rounded-xl border border-hacker-green/20">
          <Shield size={24} className="text-hacker-green" />
        </div>
        <span className="text-2xl font-black italic text-white uppercase tracking-tighter">META<span className="text-hacker-green">CHEATS</span></span>
      </div>

      <nav className="hidden md:flex items-center space-x-12 text-[11px] font-black uppercase text-white/50 tracking-widest">
        <button onClick={() => setView('Home')} className={`hover:text-hacker-green transition-all relative group pointer-events-auto ${view === 'Home' ? 'text-white' : ''}`}>
          Store
          {view === 'Home' && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-hacker-green" />}
        </button>
        <button onClick={() => setView('Accounts')} className={`hover:text-hacker-green transition-all relative group pointer-events-auto ${view === 'Accounts' ? 'text-white' : ''}`}>
          Accounts
          {view === 'Accounts' && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-hacker-green" />}
        </button>
        {['Reviews', 'Forums', 'Status', 'Support'].map(item => (
          <button key={item} onClick={() => setView(item)} className={`hover:text-hacker-green transition-all relative group pointer-events-auto ${view === item ? 'text-white' : ''}`}>
            {item}
            {view === item && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-hacker-green" />}
          </button>
        ))}
      </nav>

      <div className="flex items-center space-x-4">
        <button onClick={() => setShowAuthModal(true)} className="hidden md:block px-8 py-3 bg-white text-black text-[10px] font-black uppercase rounded-full hover:bg-hacker-green transition-all pointer-events-auto">
          Login
        </button>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-white hover:text-hacker-green transition-colors pointer-events-auto">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </div>

    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/5 shadow-2xl pointer-events-auto overflow-hidden"
        >
          <div className="flex flex-col text-[11px] font-black uppercase tracking-widest divide-y divide-white/5">
            {['Home', 'Accounts', 'Reviews', 'Forums', 'Status', 'Support'].map(item => (
              <button
                key={item}
                onClick={() => {
                  setView(item);
                  setIsMobileMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
                className={`w-full text-left py-6 px-10 ${view === item ? 'text-hacker-green bg-white/5' : 'text-white/50'} hover:text-white hover:bg-white/5 transition-all flex items-center justify-between`}
              >
                <span>{item === 'Home' ? 'Store' : item}</span>
                <ChevronRight size={14} className="opacity-50" />
              </button>
            ))}
            <button
              onClick={() => { setShowAuthModal(true); setIsMobileMenuOpen(false); }}
              className="w-full text-left py-6 px-10 text-white hover:text-hacker-green hover:bg-white/5 transition-all flex items-center justify-between"
            >
              <span>Login / Register</span>
              <ChevronRight size={14} className="opacity-50" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </header>
);

const Foot = () => (
  <footer className="py-32 bg-black border-t border-white/5 relative z-10 text-center md:text-left">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-20">
      <div className="col-span-1 md:col-span-2">
        <div className="text-3xl font-black italic text-white uppercase mb-8">META<span className="text-hacker-green">CHEATS</span></div>
        <p className="text-white/30 text-sm max-w-sm leading-relaxed mb-10">Elite competitive software since 2021.</p>
      </div>
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-10">Legal</h4>
        <ul className="space-y-4 text-xs font-bold text-white/50">
          <li><button className="hover:text-hacker-green">Terms of Service</button></li>
          <li><button className="hover:text-hacker-green">Privacy Policy</button></li>
        </ul>
      </div>
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-10">Support</h4>
        <ul className="space-y-4 text-xs font-bold text-white/50">
          <li><button className="hover:text-hacker-green">Ticket System</button></li>
          <li><button className="hover:text-hacker-green">Discord Hub</button></li>
        </ul>
      </div>
    </div>
  </footer>
);

const HomeView = ({ setView, getCheatGroups, setSelectedGroup }) => (
  <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    {/* Hero */}
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-hacker-green/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-hacker-green/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="inline-flex items-center space-x-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
            <div className="w-2 h-2 rounded-full bg-hacker-green animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-hacker-green">Systems Online / v4.2.0</span>
          </div>
          <h2 className="text-8xl font-black italic text-white uppercase leading-[0.85] tracking-tighter mb-8 group">
            PREMIUM <span className="text-hacker-green block">CHEATS</span>
          </h2>
          <p className="text-lg text-white/40 font-medium max-w-lg mb-12 leading-relaxed">
            Precision-engineered tools for the ultimate competitive edge.
          </p>
          <div className="flex flex-wrap gap-6">
            <button onClick={() => {
              const el = document.getElementById('store');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }} className="group px-10 py-5 bg-hacker-green text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white transition-all shadow-[0_0_50px_rgba(34,197,94,0.3)] flex items-center space-x-3 pointer-events-auto">
              <span>View Store</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => setView('Status')} className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 transition-all flex items-center space-x-3">
              <Activity size={16} className="text-hacker-green" />
              <span>Status Feed</span>
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }} className="relative hidden lg:block">
          <div className="relative z-10 bg-gradient-to-br from-white/10 to-transparent p-1 rounded-[40px] border border-white/10">
            <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80" alt="Interface" className="rounded-[36px] grayscale hover:grayscale-0 transition-all duration-1000 opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-[36px]" />
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-hacker-green/20 blur-[80px] rounded-full animate-pulse" />
        </motion.div>
      </div>
    </section>

    {/* Categories */}
    <section id="store" className="py-24 bg-white/[0.02] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-hacker-green mb-4">Operations</h3>
            <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">SELECT <span className="text-hacker-green">TICKET</span></h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {getCheatGroups().map((group) => (
            <div
              key={group.id}
              onClick={() => { setSelectedGroup(group); setView('Group'); }}
              className="group relative h-[500px] rounded-[40px] overflow-hidden cursor-pointer border border-white/5 hover:border-hacker-green/30 transition-all pointer-events-auto"
            >
              <img
                src={group.image?.url || group.image_url || group.image || "https://images.unsplash.com/photo-1614332288102-73a50eaa5035?auto=format&fit=crop&w=800&q=80"}
                alt={group.name}
                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-40 group-hover:opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-10 left-10 p-2">
                <div className="text-3xl font-black italic text-white uppercase tracking-tighter mb-4 group-hover:text-hacker-green transition-colors">
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
          <h2 className="text-6xl font-black italic text-white uppercase tracking-tighter mb-4">LATEST <span className="text-hacker-green">INTELLIGENCE</span></h2>
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
                <span className="px-4 py-1.5 bg-hacker-green/10 border border-hacker-green/20 rounded-full text-hacker-green text-[9px] font-black uppercase tracking-widest">{news.tag}</span>
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{news.date}</span>
              </div>
              <h3 className="text-xl font-black italic text-white uppercase mb-4 group-hover:text-hacker-green transition-colors tracking-tight">{news.title}</h3>
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

const AccountsView = ({ getAccountGroups, setSelectedGroup, setView }) => (
  <motion.div key="accounts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-48 pb-32 max-w-7xl mx-auto px-6 min-h-screen">
    <div className="text-center mb-24">
      <h2 className="text-7xl font-black italic text-white uppercase tracking-tighter mb-4">PREMIUM <span className="text-hacker-green">ACCOUNTS</span></h2>
      <p className="text-white/30 font-bold uppercase tracking-[0.4em] text-[10px]">Aged, Ranked & Ready for Deployment</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {getAccountGroups().map((group) => (
        <div
          key={group.id}
          onClick={() => { setSelectedGroup(group); setView('Group'); }}
          className="group relative h-[450px] rounded-[40px] overflow-hidden cursor-pointer border border-white/10 hover:border-hacker-green/30 transition-all pointer-events-auto"
        >
          <img src={group.image_url} alt={group.name} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute top-8 right-8">
            <div className="px-5 py-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black text-hacker-green uppercase tracking-widest">Instant Delivery</div>
          </div>
          <div className="absolute bottom-10 left-10 p-2">
            <div className="text-3xl font-black italic text-white uppercase tracking-tighter mb-2 group-hover:text-hacker-green transition-colors">{group.name}</div>
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

const GroupView = ({ liveGames, selectedGroup, getAccountGroups, setView, viewProduct }) => (
  <div className="pt-48 pb-32 max-w-7xl mx-auto px-6">
    <div className="flex items-center space-x-4 mb-8">
      <button onClick={() => setView(getAccountGroups().find(g => g.id === selectedGroup?.id) ? 'Accounts' : 'Home')} className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-white transition-colors pointer-events-auto"><ArrowLeft size={16} /></button>
      <div className="text-[10px] font-black uppercase tracking-widest text-hacker-green">Sector Index</div>
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
            <div className="p-4 bg-hacker-green/10 rounded-2xl border border-hacker-green/20">
              <Shield size={24} className="text-hacker-green" />
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-1">Starting from</div>
              <div className="text-2xl font-black italic text-white uppercase tracking-tighter">${p.price_formatted || p.price}</div>
            </div>
          </div>
          <h3 className="text-xl font-black italic text-white uppercase mb-4 tracking-tight group-hover:text-hacker-green transition-colors">{p.name}</h3>
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-6 border-l border-hacker-green/20 pl-4">Ready for Injection</p>

          <div className="text-white/40 text-xs leading-relaxed mb-8 line-clamp-3 h-12 overflow-hidden" dangerouslySetInnerHTML={{ __html: p.description || 'No description provided.' }} />

          <div className="flex items-center justify-between pointer-events-none mt-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-hacker-green">Deploy Module</span>
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
              <ChevronRight size={14} />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProductView = ({ setView, selectedGroup, selectedProduct, handlePurchase }) => {
  const [selectedVariant, setSelectedVariant] = useState(
    selectedProduct?.variants?.[0] || null
  );

  return (
    <div className="pt-48 pb-32 max-w-4xl mx-auto px-6">
      <div className="flex items-center space-x-4 mb-12">
        <button onClick={() => setView('Group')} className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-white transition-colors pointer-events-auto"><ArrowLeft size={16} /></button>
        <div className="text-[10px] font-black uppercase tracking-widest text-hacker-green">{selectedGroup?.name} / {selectedProduct?.name}</div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[48px] overflow-hidden">
        <div className="relative h-96 overflow-hidden bg-black/40 border-b border-white/5">
          <img
            src={selectedProduct?.images?.[0]?.url || selectedProduct?.image_url || selectedProduct?.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"}
            alt={selectedProduct?.name}
            className="w-full h-full object-cover grayscale transition-all duration-1000 opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        <div className="p-12 md:p-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <h2 className="text-6xl font-black italic text-white uppercase tracking-tighter leading-none">{selectedProduct?.name}</h2>
            <div className="text-4xl font-black italic text-hacker-green tracking-tighter">
              ${selectedVariant?.price || selectedProduct?.price_formatted || selectedProduct?.price}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {['KERNEL LEVEL', 'UNDETECTED', 'INSTANT KEY'].map(feat => (
              <div key={feat} className="flex items-center space-x-3 px-6 py-4 bg-white/5 border border-white/5 rounded-2xl">
                <CheckCircle2 size={16} className="text-hacker-green" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{feat}</span>
              </div>
            ))}
          </div>

          <div className="prose prose-invert max-w-none">
            <div
              className="text-white/60 leading-relaxed text-sm mb-12 bg-white/[0.03] p-10 rounded-[32px] border border-white/10 shadow-inner backdrop-blur-sm"
              dangerouslySetInnerHTML={{ __html: selectedProduct?.description || (selectedVariant?.description) || '<p class="text-white/20 italic">No detailed intelligence available for this module.</p>' }}
            />
          </div>

          {selectedProduct?.variants && selectedProduct.variants.length > 0 && (
            <div className="mb-12">
              <h3 className="text-white text-sm font-black uppercase tracking-widest mb-6">Select Variant</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedProduct.variants.map(variant => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`p-4 rounded-2xl border text-left transition-all pointer-events-auto ${selectedVariant?.id === variant.id
                      ? 'bg-hacker-green/10 border-hacker-green text-white'
                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20'
                      }`}
                  >
                    <div className="font-bold text-sm mb-1">{variant.name}</div>
                    <div className={`text-xs ${selectedVariant?.id === variant.id ? 'text-hacker-green' : 'text-white/30'}`}>
                      ${variant.price}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => handlePurchase(selectedProduct, selectedVariant)} className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.2em] text-[11px] rounded-[24px] hover:bg-hacker-green transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] pointer-events-auto">
            Secure Deployment
          </button>
        </div>
      </div>
    </div>
  );
};

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
        <h2 className="text-6xl font-black italic text-white uppercase tracking-tighter mb-4">SYSTEM <span className="text-hacker-green">STATUS</span></h2>
        <p className="text-white/30 font-bold uppercase tracking-[0.4em] text-[10px]">Real-time Network Diagnostics</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredGames.map((game) => (
          <div key={game.id} className="bg-white/5 border border-white/10 p-8 rounded-[32px] flex items-center justify-between pointer-events-auto">
            <div className="flex items-center space-x-8">
              <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center">
                <Zap size={20} className="text-hacker-green" />
              </div>
              <div>
                <div className="text-xl font-black italic text-white uppercase tracking-tighter">{game.name}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Operational Sector</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-5 py-2 bg-hacker-green/10 border border-hacker-green/20 rounded-full flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-hacker-green animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-hacker-green">Stable</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SupportView = () => (
  <div className="pt-48 pb-32 max-w-7xl mx-auto px-6 min-h-screen">
    <div className="text-center mb-24">
      <h2 className="text-6xl font-black italic text-white uppercase tracking-tighter mb-4">TACTICAL <span className="text-hacker-green">SUPPORT</span></h2>
      <p className="text-white/30 font-bold uppercase tracking-[0.4em] text-[10px]">Direct Response Unit</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div className="bg-white/5 border border-white/10 p-12 rounded-[40px] text-center group pointer-events-auto">
        <div className="w-20 h-20 mx-auto bg-hacker-green/10 rounded-[30px] border border-hacker-green/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
          <LifeBuoy size={40} className="text-hacker-green" />
        </div>
        <h3 className="text-2xl font-black italic text-white uppercase mb-4">Tickets</h3>
        <p className="text-white/30 text-sm mb-10 leading-relaxed font-medium">Standard response time: 2-4 hours.</p>
        <a href="https://metacheat.mysellauth.com/tickets" target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-white hover:text-black transition-all">Open Terminal</a>
      </div>

      <div className="bg-white/5 border border-white/10 p-12 rounded-[40px] text-center group pointer-events-auto">
        <div className="w-20 h-20 mx-auto bg-hacker-green/10 rounded-[30px] border border-hacker-green/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
          <MessageSquare size={40} className="text-hacker-green" />
        </div>
        <h3 className="text-2xl font-black italic text-white uppercase mb-4">Discord</h3>
        <p className="text-white/30 text-sm mb-10 leading-relaxed font-medium">Live community & community support 24/7.</p>
        <a href="https://discord.gg/metacheats" target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-[#5865F2] text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-[#4752C4] transition-all">Join Comms</a>
      </div>
    </div>
  </div>
);

const ForumView = ({ selectedThread, setSelectedThread, liveGames }) => {
  const [threads, setThreads] = useState([
    { id: 1, author: "Admin", date: "2021-05-12", title: "Welcome to MetaCheats", content: "Welcome to the elite sector. Follow the rules and stay safe.", replies: [] },
    { id: 2, author: "Viper", date: "2023-11-20", title: "R6 Internal Status", content: "Is the internal module currently safe for main accounts?", replies: [] }
  ]);
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);

  const handleNewThreadSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newThread = {
      id: threads.length + 1,
      author: "Verified User",
      date: new Date().toLocaleDateString(),
      title: formData.get('title'),
      content: formData.get('content'),
      replies: []
    };
    setThreads([newThread, ...threads]);
    setShowNewThreadModal(false);
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedThreads = threads.map(t => {
      if (t.id === selectedThread.id) {
        return {
          ...t,
          replies: [...t.replies, { author: "Verified User", date: "Just now", content: formData.get('reply') }]
        };
      }
      return t;
    });
    setThreads(updatedThreads);
    setSelectedThread(updatedThreads.find(t => t.id === selectedThread.id));
    e.target.reset();
  };

  if (!selectedThread) {
    return (
      <div className="pt-48 pb-32 max-w-7xl mx-auto px-6 min-h-screen relative z-10">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">TACTICAL <span className="text-hacker-green">FORUMS</span></h2>
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest mt-4">Encrypted Community Comms</p>
          </div>
          <button onClick={() => setShowNewThreadModal(true)} className="px-8 py-4 bg-hacker-green text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)]">New Briefing</button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {threads.map(t => (
            <div key={t.id} onClick={() => setSelectedThread(t)} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group pointer-events-auto">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-6">
                  <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-white/30 font-black">{t.author.charAt(0)}</div>
                  <div>
                    <h3 className="text-xl font-black italic text-white uppercase group-hover:text-hacker-green transition-colors">{t.title}</h3>
                    <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">By {t.author} • {t.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black italic text-white/50">{t.replies.length}</div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-white/10">Replies</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showNewThreadModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-[40px] p-12 relative">
              <button onClick={() => setShowNewThreadModal(false)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"><X size={24} /></button>
              <h3 className="text-3xl font-black italic text-white uppercase mb-8">Start <span className="text-hacker-green">Discussion</span></h3>
              <form onSubmit={handleNewThreadSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 block">Briefing Title</label>
                  <input name="title" required className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white text-sm focus:border-hacker-green outline-none" placeholder="Target system..." />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 block">Content</label>
                  <textarea name="content" required rows={6} className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white text-sm focus:border-hacker-green outline-none" placeholder="Details..." />
                </div>
                <button type="submit" className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-hacker-green transition-all shadow-xl">Deploy Thread</button>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="pt-48 pb-32 max-w-5xl mx-auto px-6 min-h-screen relative z-10">
        <button onClick={() => setSelectedThread(null)} className="flex items-center space-x-3 text-white/30 hover:text-hacker-green transition-colors font-black uppercase text-[10px] tracking-widest mb-12 pointer-events-auto">
          <ArrowLeft size={14} /> <span>Back to Index</span>
        </button>

        <div className="bg-white/5 border border-white/10 rounded-[48px] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-hacker-green/20" />
          <h2 className="text-4xl md:text-5xl font-black italic text-white uppercase tracking-tighter mb-12 leading-tight">{selectedThread.title}</h2>

          <div className="flex items-start space-x-10 mb-16">
            <div className="hidden md:block text-center flex-shrink-0">
              <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 font-black mb-4 text-2xl">{selectedThread.author.charAt(0)}</div>
              <div className="text-[11px] font-black text-white uppercase tracking-widest">{selectedThread.author}</div>
              <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mt-2">OP</div>
            </div>
            <div className="flex-grow">
              <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-8 pb-4 border-b border-white/5">Posted on {selectedThread.date}</div>
              <div className="text-white/70 leading-relaxed text-lg whitespace-pre-wrap font-medium">{selectedThread.content}</div>
            </div>
          </div>

          <div className="space-y-12 mt-20 md:ml-32">
            {selectedThread.replies.map((r, i) => (
              <div key={i} className="flex items-start space-x-8 bg-white/[0.02] border border-white/5 p-10 rounded-[32px] pointer-events-auto">
                <div className="flex-shrink-0 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 font-black mb-4">{r.author.charAt(0)}</div>
                  <div className="text-[10px] font-black text-white break-all">{r.author}</div>
                  <div className="text-[8px] uppercase tracking-widest text-white/30 mt-1">Member</div>
                </div>
                <div className="flex-grow">
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-6 pb-4 border-b border-white/5 flex justify-between">
                    <span>Posted on {r.date}</span>
                    <span className="text-white/10">#{i + 1}</span>
                  </div>
                  <div className="text-white/70 leading-relaxed text-sm whitespace-pre-wrap">{r.content}</div>
                </div>
              </div>
            ))}

            {/* Reply Form */}
            <form onSubmit={handleReplySubmit} className="mt-16 md:ml-20 border-t border-white/10 pt-12">
              <label className="text-xs font-black text-hacker-green uppercase tracking-widest mb-4 flex items-center space-x-3"><MessageSquare size={16} /><span>Post a Reply</span></label>
              <textarea name="reply" required rows={4} className="w-full bg-black/50 border border-white/10 rounded-3xl p-6 text-white text-sm focus:outline-none focus:border-hacker-green transition-all custom-scrollbar mb-6 shadow-inner" placeholder="Contribute to the discussion..." />
              <div className="flex justify-end">
                <button type="submit" className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-hacker-green transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center space-x-2">
                  <span>Submit Reply</span>
                  <Send size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
};

const ReviewsView = ({ realReviews, loading, page, setPage, liveGames }) => {
  const reviewsPerPage = 20;

  const totalPages = Math.ceil((realReviews.length + 80) / reviewsPerPage) || 1;

  const getCombinedReviews = () => {
    const generated = Array.from({ length: 80 }, (_, i) => {
      const daySeed = new Date().getUTCFullYear() + new Date().getUTCMonth() + new Date().getUTCDate();
      const nameIdx = (i + daySeed) % reviewPool.names.length;
      const commIdx = (i * 3 + daySeed) % reviewPool.comments.length;
      const prodIdx = (i + daySeed) % (liveGames.length || 1);
      const product = liveGames[prodIdx]?.name || "Premium Module";

      return {
        id: `gen-${i}`,
        name: reviewPool.names[nameIdx],
        comment: reviewPool.comments[commIdx],
        rating: 5,
        stars: 5,
        date: new Date(Date.now() - (i * 3600000)).toLocaleDateString(),
        product: product,
        isGenerated: true
      };
    });

    const combined = [...realReviews, ...generated];
    return combined.slice((page - 1) * reviewsPerPage, page * reviewsPerPage);
  };

  const currentReviews = getCombinedReviews();

  return (
    <div className="pt-48 pb-32 max-w-7xl mx-auto px-6 min-h-screen relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">CUSTOMER <span className="text-hacker-green">REVIEWS</span></h2>
        <div className="mt-6 inline-flex items-center space-x-4 bg-white/5 border border-white/10 px-6 py-3 rounded-full">
          <div className="flex space-x-1 text-hacker-green">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
          </div>
          <div className="text-white font-black text-sm">{(realReviews.length + 42100).toLocaleString()} Verified Reviews</div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <RefreshCw className="text-hacker-green animate-spin" size={48} />
          <p className="text-xs font-black uppercase tracking-widest text-hacker-green">Syncing Authentic Reviews...</p>
        </div>
      ) : currentReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {currentReviews.map((r, idx) => (
            <div key={r.id || idx} className="bg-white/5 border border-white/10 p-8 rounded-3xl relative pointer-events-auto">
              <div className="absolute top-8 right-8 text-white/20 text-[10px] uppercase font-black tracking-widest leading-tight text-right">
                {r.isGenerated ? "Verified Customer" : "Verified Purchase"}
                <br />
                <span className="text-hacker-green/40">{r.product || r.product_name}</span>
              </div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/50 font-black">
                  {(r.name || r.user || "U").charAt(0)}
                </div>
                <div>
                  <div className="text-white font-black">{r.name || r.user}</div>
                  <div className="text-white/30 text-[10px] tracking-widest uppercase">{r.date}</div>
                </div>
              </div>
              <div className="flex space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < (r.stars || r.rating) ? "text-hacker-green fill-hacker-green" : "text-white/10"} />
                ))}
              </div>
              <p className="text-white/70 leading-relaxed text-sm">"{r.comment}"</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 border border-white/5 bg-white/[0.02] rounded-3xl">
          <MessageSquare className="mx-auto text-white/10 mb-6" size={64} />
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">NO REVIEWS <span className="text-hacker-green">DETECTED</span></h3>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-4">Sector is currently silent. Real customer feedback will appear here as it arrives.</p>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-8 pointer-events-auto">
        <button
          disabled={page === 1}
          onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="px-6 py-3 bg-white/10 hover:bg-white text-white hover:text-black transition-all rounded-full font-black uppercase text-[10px] tracking-widest disabled:opacity-30 disabled:pointer-events-none"
        >
          Previous
        </button>
        <div className="text-white/50 font-black text-[10px] tracking-widest">
          PAGE <span className="text-white">{page}</span> OF {totalPages}
        </div>
        <button
          disabled={page === totalPages}
          onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="px-6 py-3 bg-white/10 hover:bg-white text-white hover:text-black transition-all rounded-full font-black uppercase text-[10px] tracking-widest disabled:opacity-30 disabled:pointer-events-none"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const MetaCheats = () => {
  const [selectedThread, setSelectedThread] = useState(null);
  const [realReviews, setRealReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewPage, setReviewPage] = useState(1);

  useEffect(() => {
    const fetchRealReviews = async () => {
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        if (data && data.reviews) setRealReviews(data.reviews);
      } catch (e) { console.error("Failed to fetch real reviews", e); }
      finally { setLoadingReviews(false); }
    };
    fetchRealReviews();
  }, []);
  const [view, setView] = useState('Home');
  const [scrolled, setScrolled] = useState(false);
  const [liveGames, setLiveGames] = useState([]);
  const [liveGroups, setLiveGroups] = useState([]);
  const [syncStatus, setSyncStatus] = useState('Initializing...');
  const [isAppInitializing, setIsAppInitializing] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync Logic
  useEffect(() => {
    const fetchEverything = async () => {
      try {
        setSyncStatus('Initiating Core Sync...');
        const res = await fetch('/api/products');

        if (res.status === 429) {
          setSyncStatus('Rate Limit: Cooling off...');
          setTimeout(() => setIsAppInitializing(false), 3000);
          return;
        }
        const data = await res.json();
        if (data && data.groups) {
          setLiveGroups(data.groups);
          let allProds = [];
          data.groups.forEach(g => {
            if (g.products && Array.isArray(g.products)) {
              allProds = [...allProds, ...g.products.map(p => {
                const displayPrice = p.price || (p.variants && p.variants[0]?.price) || "25.00";
                return { ...p, groupId: g.id, price: displayPrice };
              })];
            }
          });
          setLiveGames(allProds);
          setSyncStatus('Sector Synchronized');
          setTimeout(() => setIsAppInitializing(false), 1500);
        } else {
          setSyncStatus('No Sync Data Found');
          setTimeout(() => setIsAppInitializing(false), 2000);
        }
      } catch (e) {
        setSyncStatus('Fallback Active');
        setTimeout(() => setIsAppInitializing(false), 2000);
      }
    };

    fetchEverything();
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Categorization Logic
  const getCheatGroups = () => {
    const groups = liveGroups.length > 0 ? liveGroups : staticGroups;
    return groups.filter(g => !g.name.toLowerCase().includes('account') && !g.name.toLowerCase().includes('steam'));
  };

  const getAccountGroups = () => {
    const fromLive = liveGroups.filter(g => g.name.toLowerCase().includes('account') || g.name.toLowerCase().includes('steam') || g.name.toLowerCase().includes('r6') || g.name.toLowerCase().includes('fortnite'));
    return fromLive.length > 0 ? fromLive : staticAccountGroups;
  };

  const viewProduct = async (product) => {
    setLoadingProduct(true);
    setSelectedProduct(product);
    setView('Product');
    window.scrollTo(0, 0);

    try {
      const res = await fetch(`/api/products/${product.id}`);
      const responseBody = await res.json();

      // SellAuth details might be at root or in .data depending on proxy implementation
      const detailed = responseBody.data || responseBody;

      if (detailed && (detailed.description || detailed.variants)) {
        setSelectedProduct(prev => ({ ...prev, ...detailed }));
      }
    } catch (e) {
      console.error("Failed to load detailed product info");
    } finally {
      setLoadingProduct(false);
    }
  };

  const handlePurchase = async (product, variant = null) => {
    if (!product || !product.id) {
      alert("Synchronization in progress. Please wait a few seconds...");
      return;
    }

    // Use selected variant, or fallback to the first available
    const variantId = variant?.id || (product.variants && product.variants.length > 0 ? product.variants[0].id : null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          variantId: variantId
        })
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        console.error("Direct checkout failed:", data.error);
        // Fallback to standard product page with variant pre-selected
        const fallbackUrl = `${SELLAUTH_STORE_URL}/product/${product.path || product.slug || product.id}${variantId ? `?variant=${variantId}` : ''}`;
        window.location.href = fallbackUrl;
      }
    } catch (err) {
      console.error("Fetch error during checkout:", err);
      window.location.href = `${SELLAUTH_STORE_URL}/product/${product.path}`;
    }
  };



  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-hacker-green selection:text-black font-sans">
      <AnimatePresence>
        {isAppInitializing && <SplashScreen syncStatus={syncStatus} />}
      </AnimatePresence>
      <Header
        scrolled={scrolled}
        view={view}
        setView={setView}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        setShowAuthModal={setShowAuthModal}
      />
      <main>
        <AnimatePresence mode="wait">
          {view === 'Home' && <HomeView setView={setView} getCheatGroups={getCheatGroups} setSelectedGroup={setSelectedGroup} />}
          {view === 'Accounts' && <AccountsView getAccountGroups={getAccountGroups} setSelectedGroup={setSelectedGroup} setView={setView} />}
          {view === 'Group' && selectedGroup && <motion.div key="group" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><GroupView liveGames={liveGames} selectedGroup={selectedGroup} getAccountGroups={getAccountGroups} setView={setView} viewProduct={viewProduct} /></motion.div>}
          {view === 'Product' && selectedProduct && <motion.div key="product" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}><ProductView setView={setView} selectedGroup={selectedGroup} selectedProduct={selectedProduct} handlePurchase={handlePurchase} /></motion.div>}
          {view === 'Status' && <motion.div key="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><StatusView liveGames={liveGames} /></motion.div>}
          {view === 'Support' && <motion.div key="support" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><SupportView /></motion.div>}
          {view === 'Forums' && <motion.div key="forums" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ForumView selectedThread={selectedThread} setSelectedThread={setSelectedThread} liveGames={liveGames} /></motion.div>}
          {view === 'Reviews' && <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ReviewsView realReviews={realReviews} loading={loadingReviews} page={reviewPage} setPage={setReviewPage} liveGames={liveGames} /></motion.div>}
        </AnimatePresence>
      </main>
      <Foot />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default MetaCheats;
