import React, { useState, useEffect } from 'react';
import {
  Shield, Zap, Terminal, CheckCircle2, AlertTriangle, Settings, User, LogOut, Lock,
  ArrowRight, ChevronRight, Database, Search, MessageSquare, Activity, LifeBuoy,
  Star, Monitor, Filter, MoreVertical, Plus, Send, HelpCircle, FileText,
  ShoppingBag, Trash2, Minus, CreditCard, ArrowLeft, Menu, X, ShieldCheck,
  Package, ExternalLink, Info, Layers, RefreshCw, Key, CreditCard as CardIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './lib/supabase';
import AuthModal from './components/AuthModal';

const SELLAUTH_STORE_URL = "https://metacheats.sellauth.com";

// --- FALLBACKS ---
const staticGroups = [
  { id: "60326", name: "RAINBOW SIX", image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80" },
  { id: "60329", name: "FORTNITE", image_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80" },
  { id: "84914", name: "APEX LEGENDS", image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80" },
  { id: "74053", name: "CS2", image_url: "https://images.unsplash.com/photo-1542714598-040b5f812ee2?auto=format&fit=crop&w=800&q=80" }
];

const staticAccountGroups = [
  { id: "acc_r6", name: "R6 ACCOUNTS", image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80" },
  { id: "acc_fn", name: "FORTNITE ACCOUNTS", image_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80" },
  { id: "acc_steam", name: "STEAM ACCOUNTS", image_url: "https://images.unsplash.com/photo-1542714598-040b5f812ee2?auto=format&fit=crop&w=800&q=80" }
];

const MetaCheats = () => {
  const [view, setView] = useState('Home'); // Home, Group, Product, Accounts
  const [scrolled, setScrolled] = useState(false);
  const [liveGames, setLiveGames] = useState([]);
  const [liveGroups, setLiveGroups] = useState([]);
  const [syncStatus, setSyncStatus] = useState('Initializing...');
  const [isAppInitializing, setIsAppInitializing] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(false);

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
            if (g.products) allProds = [...allProds, ...g.products.map(p => ({ ...p, groupId: g.id }))];
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
      const detailed = await res.json();
      if (detailed && detailed.data) {
        setSelectedProduct(prev => ({ ...prev, ...detailed.data }));
      }
    } catch (e) {
      console.error("Failed to load detailed product info");
    } finally {
      setLoadingProduct(false);
    }
  };

  const handlePurchase = (path) => {
    if (window.SellAuth) {
      window.SellAuth.open(path);
    } else {
      window.open(`${SELLAUTH_STORE_URL}/product/${path}`, '_blank');
    }
  };

  // --- COMPONENTS ---

  const SplashScreen = () => (
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

  const Header = () => (
    <header className={`fixed top-0 w-full z-[1000] transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-xl py-4 border-b border-white/5' : 'py-10'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div onClick={() => setView('Home')} className="flex items-center space-x-3 cursor-pointer group pointer-events-auto">
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
          {['Forums', 'Status', 'Support'].map(item => (
            <button key={item} className="hover:text-hacker-green transition-all pointer-events-auto">{item}</button>
          ))}
        </nav>

        <button onClick={() => setShowAuthModal(true)} className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase rounded-full hover:bg-hacker-green transition-all pointer-events-auto">
          Login
        </button>
      </div>
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

  // --- VIEWS ---

  const HomeView = () => (
    <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
          <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80" className="w-full h-full object-cover opacity-40" alt="" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-20 w-full mb-20">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="px-3 py-1 inline-flex rounded-full bg-hacker-green/10 border border-hacker-green/20 text-hacker-green text-[10px] font-black uppercase tracking-widest mb-8">Elite Solutions</div>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white leading-[0.9] uppercase italic">PREMIUM <br /><span className="text-hacker-green text-glow">CHEATS</span></h1>
            <p className="mt-10 text-xl text-white/40 max-w-xl leading-relaxed">Precision-engineered tools for the ultimate competitive edge.</p>
            <div className="mt-12 flex space-x-6">
              <button onClick={() => document.getElementById('store').scrollIntoView({ behavior: 'smooth' })} className="px-10 py-5 bg-hacker-green text-black font-black uppercase text-xs rounded-2xl hover:bg-white transition-all pointer-events-auto">Storefront</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cheats Grid */}
      <section id="store" className="py-32 bg-[#050505] relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-hacker-green mb-4">Storefront</div>
            <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">SELECT <span className="text-hacker-green">ENVIRONMENT</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {getCheatGroups().map((group, idx) => (
              <motion.div
                key={group.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                onClick={() => { setSelectedGroup(group); setView('Group'); window.scrollTo(0, 0); }}
                className="group relative aspect-[3/4] rounded-[40px] overflow-hidden border border-white/5 hover:border-hacker-green/40 cursor-pointer transition-all duration-500 pointer-events-auto bg-black"
              >
                <img src={group.image_url || group.image || "https://images.unsplash.com/photo-1542714598-040b5f812ee2?auto=format&fit=crop&w=800&q=80"} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                <div className="absolute inset-0 p-10 flex flex-col justify-end z-20">
                  <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter group-hover:text-hacker-green transition-colors">{group.name}</h3>
                  <div className="mt-4 flex items-center text-white/20 text-[10px] font-black group-hover:text-white"><span>ENTER MODULE</span><ChevronRight size={14} className="ml-1" /></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );

  const AccountsView = () => (
    <motion.div key="accounts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-48 pb-32 max-w-7xl mx-auto px-6 min-h-screen relative z-10">
      <div className="mb-24">
        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-hacker-green mb-4">Vault</div>
        <h2 className="text-7xl font-black italic text-white uppercase tracking-tighter leading-none">PREMIUM <br /><span className="text-hacker-green">ACCOUNTS</span></h2>
      </div>

      {getAccountGroups().length === 0 ? (
        <div className="bg-white/5 rounded-[40px] p-24 text-center border border-white/10">
          <Key className="mx-auto text-white/10 mb-8" size={64} />
          <div className="text-white/20 font-black uppercase text-xs tracking-[0.4em]">Vault Synchronizing... Check Back Soon</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {getAccountGroups().map((group, idx) => (
            <motion.div
              key={group.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
              onClick={() => { setSelectedGroup(group); setView('Group'); window.scrollTo(0, 0); }}
              className="p-10 rounded-[50px] bg-white/5 border border-white/10 hover:border-hacker-green/30 transition-all cursor-pointer pointer-events-auto group relative overflow-hidden"
            >
              <div className="absolute inset-x-0 h-1 top-0 bg-hacker-green opacity-0 group-hover:opacity-100 transition-all" />
              <div className="aspect-video rounded-3xl overflow-hidden mb-8 border border-white/10">
                <img src={group.image_url || "https://images.unsplash.com/photo-1542714598-040b5f812ee2?auto=format&fit=crop&w=800&q=80"} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              </div>
              <h3 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-4">{group.name}</h3>
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-10">Full Access • Instant Email</p>
              <button className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest group-hover:bg-hacker-green transition-all">Select Category</button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );

  const GroupView = () => {
    const products = liveGames.length > 0 ? liveGames.filter(p => p.groupId === selectedGroup.id) : [];
    return (
      <div className="pt-48 pb-32 max-w-7xl mx-auto px-6 min-h-screen relative z-10">
        <button onClick={() => setView(getAccountGroups().some(a => a.id === selectedGroup.id) ? 'Accounts' : 'Home')} className="flex items-center space-x-3 text-white/30 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest mb-16 pointer-events-auto"><ArrowLeft size={16} /><span>Back To Explorer</span></button>
        <div className="flex items-center space-x-6 mb-20"><div className="w-1.5 h-16 bg-hacker-green rounded-full shadow-[0_0_20px_rgba(0,255,0,0.5)]" /><h2 className="text-7xl font-black italic text-white uppercase tracking-tighter">{selectedGroup.name}</h2></div>
        {products.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-24 text-center"><Package className="mx-auto text-white/10 mb-8" size={64} /><div className="text-white/20 font-black uppercase text-xs tracking-widest">No Active Modules in Sector</div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map(p => (
              <motion.div key={p.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass p-10 rounded-[40px] border border-white/5 hover:border-hacker-green/20 transition-all group flex flex-col pointer-events-auto">
                {p.image_url && <div className="aspect-video rounded-3xl overflow-hidden mb-8 border border-white/10"><img src={p.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-all" /></div>}
                <h3 className="text-2xl font-black italic text-white uppercase mb-4">{p.name}</h3>
                <div className="text-white/40 text-sm mb-12 line-clamp-2 leading-relaxed">{p.description ? p.description.replace(/<[^>]*>?/gm, '').substring(0, 80) + "..." : "Elite undetected software solutions."}</div>
                <div className="mt-auto space-y-6">
                  <div className="flex justify-between items-end"><span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Starting Price</span><span className="text-3xl font-black text-white">${p.price || "25.00"}</span></div>
                  <button onClick={() => viewProduct(p)} className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-hacker-green transition-all">Configure Build</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const ProductView = () => (
    <div className="pt-48 pb-32 max-w-7xl mx-auto px-6 min-h-screen relative z-10">
      <button onClick={() => setView('Group')} className="flex items-center space-x-3 text-white/30 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest mb-16 pointer-events-auto"><ArrowLeft size={16} /><span>Return To {selectedGroup?.name}</span></button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div className="aspect-square rounded-[60px] overflow-hidden border border-white/10 bg-black"><img src={selectedProduct?.image_url || selectedGroup?.image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"} className="w-full h-full object-cover opacity-80" /></div>
        <div className="flex flex-col">
          <div className="text-[10px] font-black uppercase text-hacker-green tracking-[0.4em] mb-4">Module Details</div>
          <h2 className="text-7xl font-black italic text-white uppercase tracking-tighter mb-10 leading-none">{selectedProduct?.name}</h2>
          <div className="prose prose-invert text-white/50 text-lg leading-relaxed mb-12 h-[300px] overflow-y-auto px-4 custom-scrollbar" dangerouslySetInnerHTML={{ __html: selectedProduct?.description || "High-end undetected software solution optimized for performance." }} />
          <div className="mt-auto p-12 bg-white/5 border border-white/10 rounded-[50px] space-y-8">
            <div className="flex items-center justify-between"><div><div className="text-[10px] font-black text-white/20 uppercase mb-2">Price Total</div><div className="text-5xl font-black text-white italic">${selectedProduct?.price || "25.00"}</div></div><div className="px-6 py-2 bg-hacker-green/10 border border-hacker-green/20 rounded-full text-hacker-green text-[10px] font-black uppercase tracking-widest">Instant Delivery</div></div>
            <button onClick={() => handlePurchase(selectedProduct?.path)} className="w-full py-6 bg-hacker-green text-black rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-white hover:scale-[1.02] transition-all shadow-[0_0_40px_rgba(0,255,0,0.2)] pointer-events-auto">Initialize Purchase</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-hacker-green selection:text-black font-sans">
      <AnimatePresence>{isAppInitializing && <SplashScreen />}</AnimatePresence>
      <Header />
      <main>
        <AnimatePresence mode="wait">
          {view === 'Home' && <HomeView />}
          {view === 'Accounts' && <AccountsView />}
          {view === 'Group' && selectedGroup && <motion.div key="group" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><GroupView /></motion.div>}
          {view === 'Product' && selectedProduct && <motion.div key="product" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}><ProductView /></motion.div>}
        </AnimatePresence>
      </main>
      <Foot />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default MetaCheats;
