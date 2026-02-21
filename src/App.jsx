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

const SELLAUTH_STORE_URL = "https://metacheat.mysellauth.com";

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

  const handlePurchase = async (product) => {
    if (!product || !product.id) {
      alert("Synchronization in progress. Please wait a few seconds...");
      return;
    }

    // Attempt Direct API Checkout
    const variantId = product.variants && product.variants.length > 0 ? product.variants[0].id : null;

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
        window.open(data.url, '_blank');
      } else {
        console.error("Direct checkout failed:", data.error);
        // Fallback to standard product page
        window.open(`${SELLAUTH_STORE_URL}/product/${product.path}`, '_blank');
      }
    } catch (err) {
      console.error("Fetch error during checkout:", err);
      window.open(`${SELLAUTH_STORE_URL}/product/${product.path}`, '_blank');
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
          {['Reviews', 'Forums', 'Status', 'Support'].map(item => (
            <button key={item} onClick={() => setView(item)} className={`hover:text-hacker-green transition-all relative group pointer-events-auto ${view === item ? 'text-white' : ''}`}>
              {item}
              {view === item && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-hacker-green" />}
            </button>
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
                <img src={group.image?.url || group.image_url || "https://images.unsplash.com/photo-1542714598-040b5f812ee2?auto=format&fit=crop&w=800&q=80"} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" />
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
                <img src={group.image?.url || group.image_url || "https://images.unsplash.com/photo-1542714598-040b5f812ee2?auto=format&fit=crop&w=800&q=80"} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
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
    const products = liveGames.length > 0 ? liveGames.filter(p => String(p.groupId) === String(selectedGroup.id)) : [];
    return (
      <div className="pt-48 pb-32 max-w-7xl mx-auto px-6 min-h-screen relative z-10">
        <button onClick={() => setView(getAccountGroups().some(a => String(a.id) === String(selectedGroup.id)) ? 'Accounts' : 'Home')} className="flex items-center space-x-3 text-white/30 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest mb-16 pointer-events-auto"><ArrowLeft size={16} /><span>Back To Explorer</span></button>
        <div className="flex items-center space-x-6 mb-20"><div className="w-1.5 h-16 bg-hacker-green rounded-full shadow-[0_0_20px_rgba(0,255,0,0.5)]" /><h2 className="text-7xl font-black italic text-white uppercase tracking-tighter">{selectedGroup.name}</h2></div>
        {products.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-24 text-center"><Package className="mx-auto text-white/10 mb-8" size={64} /><div className="text-white/20 font-black uppercase text-xs tracking-widest">No Active Modules in Sector</div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map(p => (
              <motion.div key={p.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass p-10 rounded-[40px] border border-white/5 hover:border-hacker-green/20 transition-all group flex flex-col pointer-events-auto">
                {(p.image_url || (p.images && p.images[0]?.url)) && (
                  <div className="aspect-video rounded-3xl overflow-hidden mb-8 border border-white/10">
                    <img src={p.image_url || p.images[0]?.url} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                  </div>
                )}
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
        <div className="aspect-square rounded-[60px] overflow-hidden border border-white/10 bg-black"><img src={selectedProduct?.image?.url || selectedProduct?.image_url || selectedGroup?.image?.url || selectedGroup?.image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"} className="w-full h-full object-cover opacity-80" /></div>
        <div className="flex flex-col">
          <div className="text-[10px] font-black uppercase text-hacker-green tracking-[0.4em] mb-4">Module Details</div>
          <h2 className="text-7xl font-black italic text-white uppercase tracking-tighter mb-10 leading-none">{selectedProduct?.name}</h2>
          <div className="prose prose-invert text-white/50 text-lg leading-relaxed mb-12 h-[300px] overflow-y-auto px-4 custom-scrollbar" dangerouslySetInnerHTML={{ __html: selectedProduct?.description || "High-end undetected software solution optimized for performance." }} />
          <div className="mt-auto p-12 bg-white/5 border border-white/10 rounded-[50px] space-y-8">
            <div className="flex items-center justify-between"><div><div className="text-[10px] font-black text-white/20 uppercase mb-2">Price Total</div><div className="text-5xl font-black text-white italic">${selectedProduct?.price || "25.00"}</div></div><div className="px-6 py-2 bg-hacker-green/10 border border-hacker-green/20 rounded-full text-hacker-green text-[10px] font-black uppercase tracking-widest">Instant Delivery</div></div>
            <button
              onClick={() => handlePurchase(selectedProduct)}
              disabled={!selectedProduct?.path}
              className={`w-full py-6 rounded-3xl font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_40px_rgba(0,255,0,0.2)] pointer-events-auto ${!selectedProduct?.path ? 'bg-white/10 text-white/20 cursor-not-allowed' : 'bg-hacker-green text-black hover:bg-white hover:scale-[1.02]'}`}
            >
              {selectedProduct?.path ? 'Initialize Purchase' : 'Awaiting Data Sync...'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const StatusView = () => (
    <div className="pt-48 pb-32 max-w-7xl mx-auto px-6 min-h-screen relative z-10">
      <div className="mb-20 text-center">
        <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">SYSTEM <span className="text-hacker-green">STATUS</span></h2>
        <p className="text-white/40 mt-4 max-w-2xl mx-auto">Real-time operational status of all MetaCheats modules. We monitor all supported titles 24/7 to ensure maximum security.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {allProds.map(p => (
          <div key={p.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex justify-between items-center hover:border-white/20 transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-black border border-white/10 overflow-hidden">
                <img src={p.image_url || p.images?.[0]?.url || "https://images.unsplash.com/photo-1542714598-040b5f812ee2?auto=format&fit=crop&w=100&q=80"} className="w-full h-full object-cover opacity-60" />
              </div>
              <div>
                <div className="text-white font-black uppercase text-sm">{p.name}</div>
                <div className="text-white/30 text-[10px] uppercase tracking-widest">{new Date().toLocaleDateString()}</div>
              </div>
            </div>
            <div className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-hacker-green/10 text-hacker-green border border-hacker-green/20 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-hacker-green animate-pulse" />
              <span>Undetected</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SupportView = () => (
    <div className="pt-48 pb-32 max-w-7xl mx-auto px-6 min-h-screen relative z-10 flex flex-col items-center">
      <div className="mb-16 text-center">
        <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">SUPPORT <span className="text-hacker-green">DESK</span></h2>
        <p className="text-white/40 mt-4 max-w-xl mx-auto">Need assistance with a configuration? Open a secure ticket with our 24/7 technical team.</p>
      </div>
      <form className="w-full max-w-2xl bg-white/5 border border-white/10 p-10 rounded-[40px] space-y-6 pointer-events-auto" onSubmit={(e) => { e.preventDefault(); alert('Ticket submitted to central queue. A technician will reply shortly.'); }}>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-4">Username</label>
            <input required type="text" className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-hacker-green transition-all" placeholder="Enter username..." />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-4">Order Email</label>
            <input required type="email" className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-hacker-green transition-all" placeholder="Enter email..." />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-4">Department</label>
          <select className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-hacker-green transition-all appearance-none cursor-pointer">
            <option>Technical Support (Injection/Errors)</option>
            <option>Sales & Billing (Upgrades/Refunds)</option>
            <option>HWID Resets (Hardware Changes)</option>
            <option>General Investigation</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-4">Issue Description</label>
          <textarea required rows={6} className="w-full bg-black/50 border border-white/10 rounded-2xl p-6 text-white placeholder-white/20 focus:outline-none focus:border-hacker-green transition-all custom-scrollbar" placeholder="Describe the problem in detail. Include any error codes..." />
        </div>
        <button type="submit" className="w-full py-5 bg-hacker-green text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white transition-all shadow-[0_0_30px_rgba(0,255,0,0.15)] mt-4">Submit Secure Ticket</button>
      </form>
    </div>
  );

  const ForumView = () => (
    <div className="pt-48 pb-32 max-w-7xl mx-auto px-6 min-h-screen relative z-10">
      <div className="flex items-center justify-between mb-16">
        <div>
          <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">COMMUNITY <span className="text-hacker-green">FORUMS</span></h2>
          <p className="text-white/40 mt-2">Connect with elite users, share configs, and read announcements.</p>
        </div>
        <button className="px-6 py-3 bg-white/10 text-white hover:bg-hacker-green hover:text-black transition-all rounded-full text-[10px] font-black uppercase tracking-widest pointer-events-auto">New Thread</button>
      </div>

      <div className="space-y-8 pointer-events-auto">
        {[
          { icon: <Shield size={24} />, title: 'Official Announcements', desc: 'Updates directly from the MetaCheats administration.', posts: 142, color: 'text-hacker-green' },
          { icon: <RefreshCw size={24} />, title: 'Release Notes', desc: 'Detailed patch notes for all module updates.', posts: 89, color: 'text-blue-400' },
          { icon: <UploadCloud size={24} />, title: 'User Configs (Verified)', desc: 'Share and download HvH / Legit configs.', posts: 3402, color: 'text-purple-400' },
          { icon: <Package size={24} />, title: 'General Discussion', desc: 'Talk about anything gaming related.', posts: 8911, color: 'text-white/60' }
        ].map((forum, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-[30px] p-8 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer group">
            <div className="flex items-center space-x-6">
              <div className={`w-16 h-16 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-center ${forum.color} group-hover:scale-110 transition-transform`}>
                {forum.icon}
              </div>
              <div>
                <h3 className="text-xl font-black uppercase text-white tracking-wide mb-1 flex items-center gap-3">{forum.title} <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white/50">Category</span></h3>
                <p className="text-sm text-white/40">{forum.desc}</p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-2xl font-black text-white">{forum.posts.toLocaleString()}</div>
              <div className="text-[9px] uppercase tracking-widest text-white/30">Total Posts</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ReviewsView = () => {
    // Procedural generation to avoid 42k array crashing DOM
    const [page, setPage] = React.useState(1);
    const reviewsPerPage = 20;
    const totalReviews = 42000;
    const totalPages = Math.ceil(totalReviews / reviewsPerPage);

    // Seeded random for consistent bad review placement
    const isBadReview = (index) => {
      const seed = Math.sin(index * 13.37) * 42000;
      return (seed - Math.floor(seed)) < 0.05; // 5% chance exactly
    };

    const getReviewDate = (index) => {
      const d = new Date();
      // Distribute 42000 reviews roughly backward over 3 years (1000 days). Approx 42 reviews per day.
      const daysBack = Math.floor(index / 42);
      d.setDate(d.getDate() - daysBack);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const goodComments = [
      "Unbelievable quality. Instant delivery and injection was flawless.",
      "Best chair I've ever used. Completely undetected for months.",
      "Support replied in 2 minutes and helped me setup. 10/10.",
      "Aimbot is highly customizable. Hit champion rank easily.",
      "ESP is incredibly clean. No lag or FPS drops at all.",
      "Been buying from MetaCheats for a year. Never banned.",
      "Honestly the most premium menu I've seen. Worth every penny.",
      "Works perfectly on Windows 11. Very impressive.",
      "The spoofer works like a charm. Got back in instantly.",
      "Highly recommended. Fast, secure, and undetected.",
      "Streamproof works flawlessly. Highly recommend for streamers.",
      "Simplest injection process. Just open and play."
    ];

    const badComments = [
      "Had trouble injecting on Windows 10 updated. Waiting on support.",
      "A feature is currently down for maintenance.",
      "Setup was a bit confusing for a beginner.",
      "Wish the menu had more customizable colors.",
      "Took 5 minutes for the email to arrive instead of instant.",
      "Anti-virus kept deleting the loader, had to make exclusions."
    ];

    const generateReviews = () => {
      const startIndex = (page - 1) * reviewsPerPage;
      const arr = [];
      for (let i = 0; i < reviewsPerPage; i++) {
        const globalIndex = startIndex + i;
        if (globalIndex >= totalReviews) break;

        const isBad = isBadReview(globalIndex);
        const nameSeed = Math.abs(Math.sin((globalIndex + 1) * 7.7) * 10000);
        const nameInt = Math.floor(nameSeed);
        const anonName = `User${nameInt}`;

        // Random comment based on good/bad
        const commentList = isBad ? badComments : goodComments;
        const cIndex = (nameInt + globalIndex) % commentList.length;

        arr.push({
          id: globalIndex,
          name: anonName,
          date: getReviewDate(globalIndex),
          stars: isBad ? (1 + (nameInt % 3)) : 5, // 1-3 stars for bad, 5 for good
          comment: commentList[cIndex]
        });
      }
      return arr;
    };

    const currentReviews = generateReviews();

    return (
      <div className="pt-48 pb-32 max-w-7xl mx-auto px-6 min-h-screen relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">CUSTOMER <span className="text-hacker-green">REVIEWS</span></h2>
          <div className="mt-6 inline-flex items-center space-x-4 bg-white/5 border border-white/10 px-6 py-3 rounded-full">
            <div className="flex space-x-1 text-hacker-green">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <div className="text-white font-black text-sm">{totalReviews.toLocaleString()} Verified Reviews</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {currentReviews.map(r => (
            <div key={r.id} className="bg-white/5 border border-white/10 p-8 rounded-3xl relative pointer-events-auto">
              <div className="absolute top-8 right-8 text-white/20 text-[10px] uppercase font-black tracking-widest">Verified Purchase</div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/50 font-black">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-black">{r.name}</div>
                  <div className="text-white/30 text-[10px] tracking-widest uppercase">{r.date}</div>
                </div>
              </div>
              <div className="flex space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < r.stars ? "text-hacker-green fill-hacker-green" : "text-white/10"} />
                ))}
              </div>
              <p className="text-white/70 leading-relaxed text-sm">"{r.comment}"</p>
            </div>
          ))}
        </div>

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
          {view === 'Status' && <motion.div key="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><StatusView /></motion.div>}
          {view === 'Support' && <motion.div key="support" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><SupportView /></motion.div>}
          {view === 'Forums' && <motion.div key="forums" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ForumView /></motion.div>}
          {view === 'Reviews' && <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ReviewsView /></motion.div>}
        </AnimatePresence>
      </main>
      <Foot />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default MetaCheats;
