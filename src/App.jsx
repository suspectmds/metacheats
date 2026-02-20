import React, { useState, useEffect } from 'react';
import {
  Shield,
  Zap,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Settings,
  User,
  LogOut,
  Lock,
  ArrowRight,
  ChevronRight,
  Database,
  Search,
  MessageSquare,
  Activity,
  LifeBuoy,
  Star,
  Monitor,
  Filter,
  MoreVertical,
  Plus,
  Send,
  HelpCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MetaCheats = () => {
  const [view, setView] = useState('Home');
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userBalance, setUserBalance] = useState(240.25);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [liveGames, setLiveGames] = useState([]);
  const [liveAccounts, setLiveAccounts] = useState([]);
  const [liveReviews, setLiveReviews] = useState([]);

  const generateSimulatedReviews = () => {
    const names = ["Shadow", "Hacker", "Viper", "Ghost", "Zero", "Elite", "Kernel", "Root", "Silent", "Void", "Rogue", "Cyborg", "Neon", "Cyber", "Dark", "Frost"];
    const suffixes = ["_x", "Master", "One", "99", "Pro", "Dev", "User", "Gamer", "Collector", "Hunter"];
    const positiveComments = [
      "Absolute beast of a tool. Haven't been banned in 3 months.",
      "The best support I've ever dealt with, help me setup DMA in under 5 minutes.",
      "Kernaim prediction is just built different. 10/10.",
      "Finally a provider that doesn't exit scam. Legit services.",
      "Smooth as butter. Movement hacks are insane on this.",
      "Been with MetaCheats since the start. Never disappointed.",
      "The new UI is clean. Everything works perfectly.",
      "Undetected for the whole season. Worth every penny.",
      "Instant delivery, setup was simple. Running 4K 144Hz with no lag.",
      "Best external on the market right now."
    ];
    const negativeComments = [
      "Took 10 minutes for support to reply, but they fixed it.",
      "The spoofer had a small bug but the update fixed it today."
    ];
    const games = ["Apex Legends", "CS2", "Fortnite", "Rust", "DayZ", "Rainbow Six", "Battlefield"];

    const simulated = Array.from({ length: 150 }).map((_, i) => {
      const isNegative = i === 10 || i === 50; // Add a couple "real" looking neutral/slightly negative reviews
      return {
        user: names[Math.floor(Math.random() * names.length)] + suffixes[Math.floor(Math.random() * suffixes.length)],
        date: `${Math.floor(Math.random() * 28)} days ago`,
        rating: isNegative ? 4 : 5,
        comment: isNegative ? negativeComments[Math.floor(Math.random() * negativeComments.length)] : positiveComments[Math.floor(Math.random() * positiveComments.length)],
        product: games[Math.floor(Math.random() * games.length)]
      };
    });
    return simulated;
  };

  // OFFICIAL SELLAUTH GROUP MAPPING
  const GROUP_IDS = {
    R6: "60326",
    SPOOFERS: "60327",
    ACCOUNTS: "87896",
    FORTNITE: "60329",
    CS2: "74053",
    EFT: "82832",
    RUST: "83750",
    APEX: "84914",
    BATTLEFIELD: "85254",
    OTHER: "86711"
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // Load SellAuth Embed Script
    const script = document.createElement('script');
    script.src = "https://sellauth.com/js/embed.js";
    script.async = true;
    document.body.appendChild(script);

    // Poll for balance updates from backend
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/balance?username=APEXE');
        const data = await res.json();
        setUserBalance(data.balance);
      } catch (e) { }
    }, 10000);

    // Fetch Products
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const allGroups = data.groups || [];

        // Distribute products into categories
        let gamesAggregator = [];
        let accountsAggregator = [];

        allGroups.forEach(group => {
          const gid = group.id.toString();
          if (gid === GROUP_IDS.ACCOUNTS) {
            accountsAggregator = [...accountsAggregator, ...group.products];
          } else if (Object.values(GROUP_IDS).includes(gid)) {
            // All other game groups go into games
            gamesAggregator = [...gamesAggregator, ...group.products];
          }
        });

        if (gamesAggregator.length > 0) setLiveGames(gamesAggregator);
        if (accountsAggregator.length > 0) setLiveAccounts(accountsAggregator);
      } catch (e) { }
    };

    // Fetch Reviews
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        const realReviews = data.reviews || [];
        const simulated = generateSimulatedReviews();
        setLiveReviews([...realReviews, ...simulated]);
      } catch (e) {
        setLiveReviews(generateSimulatedReviews());
      }
    };

    fetchProducts();
    fetchReviews();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const handleLogin = (admin = false) => {
    setIsLoggedIn(true);
    setIsAdmin(admin);
    setView(admin ? 'AdminDashboard' : 'UserDashboard');
  };

  const navItems = [
    { label: 'Cheats', icon: <Zap size={16} /> },
    { label: 'Accounts', icon: <User size={16} /> },
    { label: 'Forums', icon: <Terminal size={16} /> },
    { label: 'Status', icon: <Activity size={16} /> },
    { label: 'Support', icon: <LifeBuoy size={16} /> },
    { label: 'Reviews', icon: <Star size={16} /> },
  ];

  const SELLAUTH_STORE_URL = "https://metacheat.mysellauth.com"; // Official SellAuth Link

  const handlePurchase = (productId) => {
    // Official SellAuth Embed Trigger
    if (window.SellAuth) {
      window.SellAuth.open(productId);
    } else {
      window.open(`${SELLAUTH_STORE_URL}/product/${productId}`, '_blank');
    }
  };

  const handleDeposit = (method) => {
    // Redirect to your specific SellAuth balance top-up product
    window.open(`${SELLAUTH_STORE_URL}/checkout/deposit?method=${method}`, '_blank');
  };

  const games = [
    { name: "Apex Legends", status: "Undetected", since: "2 weeks", productId: "PROD_ID_APEX", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80" },
    { name: "Counter-Strike 2", status: "Undetected", since: "1 month", productId: "PROD_ID_CS2", image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800&q=80" },
    { name: "DayZ", status: "Updating", since: "1 day", productId: "PROD_ID_DAYZ", image: "https://images.unsplash.com/photo-1552824236-077641c1d1fa?auto=format&fit=crop&w=800&q=80" },
    { name: "Rust", status: "Undetected", since: "3 weeks", productId: "PROD_ID_RUST", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80" },
    { name: "Fortnite", status: "Use at Risk", since: "3 days", productId: "PROD_ID_FORTNITE", image: "https://images.unsplash.com/photo-1589241062272-c0a000072dfa?auto=format&fit=crop&w=800&q=80" },
    { name: "Call of Duty", status: "Undetected", since: "5 days", productId: "PROD_ID_COD", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80" }
  ];

  const accounts = [
    { name: "Apex Masters Account", price: "$45.00", stock: "12", productId: "ACC_ID_APEX", platform: "Steam", skins: "150+", level: "500", rank: "Masters" },
    { name: "CS2 Prime Global", price: "$32.00", stock: "5", productId: "ACC_ID_CS2", platform: "Steam", skins: "Knife + Gloves", level: "40", rank: "Global Elite" },
    { name: "Valorant Ascendant", price: "$28.00", stock: "8", productId: "ACC_ID_VAL", platform: "Riot", skins: "Vandal + Phantom", level: "65", rank: "Ascendant" },
    { name: "Fortnite OG Account", price: "$120.00", stock: "2", productId: "ACC_ID_FORTNITE", platform: "Epic", skins: "Renegade Raider", level: "1200", rank: "N/A" }
  ];

  const DepositModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
    >
      <div className="glass p-10 rounded-3xl max-w-lg w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6">
          <button onClick={() => setShowDepositModal(false)} className="text-gray-500 hover:text-white transition-colors">
            <LogOut className="rotate-45" size={24} />
          </button>
        </div>

        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 bg-hacker-green/20 rounded-2xl mx-auto flex items-center justify-center border border-hacker-green/30">
            <Zap className="text-hacker-green" size={32} />
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">Add <span className="text-hacker-green">MetaCredits</span></h2>
          <p className="text-xs text-gray-400">Select your preferred payment method to top up your account balance instantly via SellAuth.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => handleDeposit('venmo')}
            className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-[#00ADEE] hover:bg-[#00ADEE]/5 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#00ADEE] rounded-lg flex items-center justify-center text-white font-black">V</div>
              <div className="text-left">
                <div className="text-sm font-black text-white">Venmo</div>
                <div className="text-[10px] text-gray-500">Instant Activation</div>
              </div>
            </div>
            <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" />
          </button>

          <button
            onClick={() => handleDeposit('square')}
            className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-[#3E4348] hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-black font-black">S</div>
              <div className="text-left">
                <div className="text-sm font-black text-white">Square (Card)</div>
                <div className="text-[10px] text-gray-500">Visa / Mastercard / Google Pay</div>
              </div>
            </div>
            <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" />
          </button>
        </div>

        <p className="text-center text-[9px] text-gray-600 mt-10 font-bold uppercase tracking-widest">Securely processed by SellAuth Encryption</p>
      </div>
    </motion.div>
  );

  const AccountsShopView = () => (
    <section className="py-32 max-w-7xl mx-auto px-6">
      <div className="flex flex-col space-y-4 mb-12">
        <div className="h-1 w-12 bg-hacker-green" />
        <h2 className="text-5xl font-black tracking-tight uppercase italic line-clamp-1">ACCOUNTS <span className="text-hacker-green font-normal not-italic">MARKETPLACE</span></h2>
        <p className="text-gray-500 text-sm max-w-xl">High-end aged and ranked accounts with premium skins. Instant delivery via SellAuth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(liveAccounts.length > 0 ? liveAccounts : accounts).map((acc, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="glass p-6 rounded-2xl border border-white/5 hover:border-hacker-green/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="px-3 py-1 bg-hacker-green/10 text-hacker-green rounded text-[9px] font-black uppercase tracking-widest">
                {acc.platform || "STEAM"}
              </div>
              <div className="text-right">
                <div className="text-[9px] font-bold text-gray-600">STOCK</div>
                <div className="text-xs font-black">{acc.stock || acc.stock_count || 0}</div>
              </div>
            </div>

            <h3 className="text-lg font-black text-white mb-2">{acc.name}</h3>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500 uppercase font-bold">Rank</span>
                <span className="text-hacker-green font-black">{acc.rank || "N/A"}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500 uppercase font-bold">Attributes</span>
                <span className="text-white font-black">{acc.skins || "Instant Delivery"}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500 uppercase font-bold">Platform</span>
                <span className="text-white font-black">{acc.platform || "PC"}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="text-2xl font-black italic">${acc.price || acc.unit_price || "0.00"}</div>
              <button
                onClick={() => handlePurchase(acc.productId || acc.id)}
                className="px-4 py-2 bg-hacker-green text-black font-black text-[10px] rounded uppercase hover:shadow-[0_0_15px_rgba(0,255,0,0.5)] transition-all"
              >
                Buy Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );

  const ForumsView = () => (
    <section className="py-32 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="flex flex-col space-y-4">
          <div className="h-1 w-12 bg-hacker-green" />
          <h2 className="text-5xl font-black tracking-tight uppercase italic">COMMUNITY <span className="text-hacker-green font-normal not-italic">FORUMS</span></h2>
          <p className="text-gray-500 text-sm max-w-xl">Discuss strategies, check announcements, and interact with the MetaCheats community.</p>
        </div>
        <button className="px-8 py-3 bg-hacker-green text-black font-black text-xs rounded uppercase hover:shadow-[0_0_20px_rgba(0,255,0,0.4)] transition-all flex items-center gap-2">
          <Plus size={18} /> New Thread
        </button>
      </div>

      <div className="space-y-6">
        {[
          {
            cat: "ANNOUNCEMENTS", icon: <AlertTriangle size={20} className="text-yellow-500" />, threads: [
              { title: "MetaCheats v2.4 Release Notes", author: "Admin", posts: 142, views: "2.1K", time: "2h ago" },
              { title: "New DMA Hardware Support Added", author: "Staff", posts: 88, views: "1.4K", time: "5h ago" }
            ]
          },
          {
            cat: "CLIENT SOFTWARE", icon: <Zap size={20} className="text-hacker-green" />, threads: [
              { title: "Apex External tap-strafe config share", author: "ProUser77", posts: 24, views: "850", time: "12m ago" },
              { title: "CS2 Internal setup guide for beginners", author: "Staff", posts: 156, views: "5.2K", time: "1d ago" }
            ]
          },
          {
            cat: "GENERAL DISCUSSION", icon: <MessageSquare size={20} className="text-blue-500" />, threads: [
              { title: "What game should we support next?", author: "Admin", posts: 412, views: "12K", time: "1h ago" },
              { title: "Review: 6 months with MetaCheats", author: "VipMember", posts: 12, views: "340", time: "6h ago" }
            ]
          }
        ].map((section, si) => (
          <div key={si} className="glass rounded-3xl overflow-hidden border border-white/5">
            <div className="bg-white/5 px-8 py-4 flex items-center gap-4 border-b border-white/5">
              {section.icon}
              <h3 className="text-sm font-black tracking-[0.2em]">{section.cat}</h3>
            </div>
            <div className="divide-y divide-white/5">
              {section.threads.map((thread, ti) => (
                <div key={ti} className="p-8 flex items-center justify-between group hover:bg-hacker-green/5 transition-all cursor-pointer">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center font-black text-hacker-green">
                      {thread.author[0]}
                    </div>
                    <div>
                      <h4 className="text-lg font-black group-hover:text-hacker-green transition-colors">{thread.title}</h4>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-widest">
                        <span className="text-hacker-green/70">BY {thread.author}</span>
                        <span>•</span>
                        <span>{thread.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-12 text-center hidden md:flex">
                    <div>
                      <div className="text-xs font-black">{thread.posts}</div>
                      <div className="text-[9px] font-bold text-gray-600 uppercase">Posts</div>
                    </div>
                    <div>
                      <div className="text-xs font-black">{thread.views}</div>
                      <div className="text-[9px] font-bold text-gray-600 uppercase">Views</div>
                    </div>
                    <ChevronRight className="text-gray-600 group-hover:text-hacker-green transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const SupportView = () => (
    <section className="py-32 max-w-7xl mx-auto px-6">
      <div className="text-center space-y-6 mb-20">
        <div className="h-1 w-12 bg-hacker-green mx-auto" />
        <h2 className="text-6xl font-black tracking-tight uppercase italic underline decoration-hacker-green/30 decoration-8 underline-offset-8">SUPPORT <span className="text-hacker-green font-normal not-italic">HUB</span></h2>
        <p className="text-gray-500 text-sm max-w-xl mx-auto">Need assistance? Check our FAQ or open a ticket with our 24/7 technical support team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* FAQ Area */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-black italic mb-8 flex items-center gap-4">
            <HelpCircle className="text-hacker-green" /> FREQUENTLY ASKED QUESTIONS
          </h3>
          {[
            { q: "How do I activate my license key?", a: "Once purchased, your key will appear in your dashboard. Enter it into the software during initial launch to bind your HWID and start your subscription." },
            { q: "Is the software compatible with Windows 11?", a: "Yes, all our current software products support both Windows 10 and Windows 11 (22H2 and older versions)." },
            { q: "What should I do if I get detected?", a: "While our tools aim for maximum security, if a detection occurs, we instantly flag the software as 'Updating' and provide compensatory time to all active users." }
          ].map((item, i) => (
            <div key={i} className="glass p-8 rounded-3xl border border-white/5 hover:border-hacker-green/20 transition-all cursor-pointer group">
              <h4 className="text-lg font-black mb-4 flex justify-between items-center group-hover:text-hacker-green transition-colors">
                {item.q}
                <Plus size={16} className="text-gray-600" />
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.a}</p>
            </div>
          ))}
        </div>

        {/* Ticket Sidebar */}
        <div className="space-y-8">
          <div className="glass p-10 rounded-[40px] border-t-4 border-t-hacker-green space-y-6">
            <div className="w-16 h-16 bg-hacker-green/10 rounded-2xl flex items-center justify-center border border-hacker-green/20">
              <LifeBuoy className="text-hacker-green" size={32} />
            </div>
            <h3 className="text-2xl font-black tracking-tighter italic">OPEN A HELP TICKET</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Average response time is currently <span className="text-hacker-green font-black">12 MINUTES</span>. Our staff is standing by.</p>
            <button className="w-full py-5 bg-white text-black font-black text-sm rounded-2xl uppercase hover:bg-gray-200 transition-all shadow-xl shadow-white/5">
              Create New Ticket
            </button>
          </div>

          <div className="glass p-10 rounded-[40px] border border-white/5 space-y-6">
            <h3 className="text-xs font-black tracking-[0.3em] text-gray-500 uppercase">PLATFORM POLICIES</h3>
            <div className="space-y-4">
              <button onClick={() => setView('Legal')} className="w-full flex items-center justify-between group">
                <span className="text-sm font-black text-gray-400 group-hover:text-white transition-colors">Terms of Service</span>
                <FileText size={16} className="text-gray-700 group-hover:text-hacker-green transition-colors" />
              </button>
              <button onClick={() => setView('Legal')} className="w-full flex items-center justify-between group">
                <span className="text-sm font-black text-gray-400 group-hover:text-white transition-colors">Privacy Policy</span>
                <FileText size={16} className="text-gray-700 group-hover:text-hacker-green transition-colors" />
              </button>
              <button onClick={() => setView('Legal')} className="w-full flex items-center justify-between group">
                <span className="text-sm font-black text-gray-400 group-hover:text-white transition-colors">Refund Policy</span>
                <FileText size={16} className="text-gray-700 group-hover:text-hacker-green transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const LegalView = () => (
    <section className="py-40 max-w-4xl mx-auto px-6">
      <div className="space-y-12">
        <div className="space-y-4">
          <div className="h-1 w-12 bg-hacker-green" />
          <h2 className="text-6xl font-black tracking-tighter italic">TERMS OF <span className="text-hacker-green">SERVICE</span></h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Last Updated: February 20, 2026</p>
        </div>

        <div className="space-y-16 prose prose-invert max-w-none">
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-white italic tracking-tight">1. ACCEPTANCE OF TERMS</h3>
            <p className="text-md text-gray-400 leading-relaxed font-medium">
              By accessing or using the MetaCheats platform, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services. We provide high-end game enhancements for entertainment purposes only.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black text-white italic tracking-tight">2. USAGE & COMPLIANCE</h3>
            <p className="text-md text-gray-400 leading-relaxed font-medium">
              MetaCheats holds no responsibility for any actions taken by third-party game developers against your game accounts. By using our software, you acknowledge the inherent risks associated with using technical modifications in online gaming environments.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black text-white italic tracking-tight">3. NO REFUND POLICY</h3>
            <p className="text-md text-gray-400 leading-relaxed font-medium">
              Due to the digital nature of our products, all sales are final. MetaCheats does not offer refunds unless under exceptional circumstances at the sole discretion of our administrative staff.
            </p>
          </div>
        </div>

        <div className="pt-20 border-t border-white/5 text-center">
          <button onClick={() => setView('Home')} className="text-xs font-black text-hacker-green uppercase tracking-[0.3em] hover:text-white transition-colors">
            Return to Command Center
          </button>
        </div>
      </div>
    </section>
  );

  const ReviewsView = () => (
    <section className="py-32 max-w-7xl mx-auto px-6">
      <div className="flex flex-col space-y-4 mb-12">
        <div className="h-1 w-12 bg-hacker-green" />
        <h2 className="text-5xl font-black tracking-tight uppercase italic">USER <span className="text-hacker-green font-normal not-italic">REVIEWS</span></h2>
        <p className="text-gray-500 text-sm max-w-xl">Verified feedback from our community members. Our 4.9/5 rating is built on trust and 42,000+ positive experiences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(liveReviews.length > 0 ? liveReviews : [
          { user: "ShadowReaper", rank: "VIP", text: "Best apex external I have ever used. Performance is insane and support team is actually helpful.", date: "2 days ago", rating: 5 },
          { user: "KernelMaster", rank: "Premium", text: "Day 90 of using Kernaim and still undetected. The prediction logic is ahead of everything else on the market.", date: "1 week ago", rating: 5 },
          { user: "SilentAimer", rank: "Member", text: "Setup was a bit tricky but the staff helped me through discord in less than 5 minutes. 10/10 service.", date: "3 days ago", rating: 5 }
        ]).map((rev, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-3xl border border-white/5 relative group hover:border-hacker-green/20 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-xl bg-hacker-green/10 flex items-center justify-center font-black text-hacker-green border border-hacker-green/20 text-xs">
                  {rev.user[0]}
                </div>
                <div>
                  <div className="text-sm font-black">{rev.user}</div>
                  <div className="text-[10px] font-bold text-hacker-green uppercase tracking-widest">{rev.rank}</div>
                </div>
              </div>
              <div className="flex text-yellow-500">
                {[...Array(rev.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
              </div>
            </div>
            <p className="text-gray-400 text-sm italic leading-relaxed">"{rev.text || rev.comment}"</p>
            <div className="mt-6 pt-6 border-t border-white/5 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
              POSTED {rev.date}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );

  const LandingView = () => (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center pt-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-2/3 h-full matrix-bg opacity-40 translate-x-12">
            <img
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"
              className="w-full h-full object-cover grayscale brightness-[0.3] mix-blend-screen"
              alt="Character Render"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          </div>
          <div className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-hacker-green/5 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col space-y-6"
            >
              <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
                High-Quality <br />
                Cheats <span className="text-hacker-green text-glow">Solutions</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-xl leading-relaxed">
                Your #1 trusted cheat provider, offering high-quality, reliable products for amazing prices with top notch customer support.
              </p>

              <div className="flex items-center space-x-12 py-8">
                <div>
                  <div className="text-3xl font-black text-hacker-green">120,000+</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Cheats Delivered</div>
                </div>
                <div className="flex flex-col">
                  <div className="flex text-yellow-500 mb-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">4.9/5 from 42,000+ reviews</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Sorting Bar (Integrated into next section) */}
      <section className="bg-hacker-gray/30 border-y border-white/5 py-3 sticky top-[138px] z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="px-5 py-2 rounded bg-hacker-green text-black text-xs font-black uppercase shadow-[0_0_10px_rgba(0,255,0,0.3)]">All Products</button>
            {['A', 'B', 'C', 'D', 'E', 'F', 'H', 'M', 'Q', 'P', 'R', 'S', 'T', 'U', 'V', 'W'].map(l => (
              <button key={l} className="w-8 h-8 rounded hover:bg-white/5 text-gray-500 hover:text-white transition-all text-xs font-bold">{l}</button>
            ))}
          </div>
          <div className="flex items-center space-x-2 text-hacker-green text-xs font-black uppercase">
            <Monitor size={14} />
            <span>40 Games Supported</span>
          </div>
        </div>
      </section>

      {/* Product Content */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex flex-col space-y-4 mb-12">
          <div className="h-1 w-12 bg-hacker-green" />
          <h2 className="text-3xl font-black tracking-tight uppercase italic">Popular <span className="text-hacker-green font-normal not-italic">Products</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(liveGames.length > 0 ? liveGames : games).map((game, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              onClick={() => handlePurchase(game.productId || game.id)}
              className="group relative bg-[#0d0d0d] rounded-xl overflow-hidden border border-white/5 hover:border-hacker-green/50 transition-all cursor-pointer"
            >
              <div className="aspect-[16/10] relative">
                <img src={game.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt={game.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />

                {/* Status Overlay */}
                <div className="absolute inset-0 flex items-center justify-center translate-y-4">
                  <div className="text-center">
                    <div className="text-xs font-black tracking-[0.2em] text-white/50 group-hover:text-white transition-colors">{game.name.toUpperCase()}</div>
                    <div className={`text-2xl font-black italic mt-1 ${game.status === 'Updating' ? 'text-yellow-500' : 'text-hacker-green'}`}>{game.status === 'Updating' ? 'UPDATING' : 'HACKS'}</div>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-black/80 rounded border border-white/10 text-[10px] font-black uppercase tracking-widest text-hacker-green">
                    {game.name}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Detailed Status List (Matching Image 4) */}
      <section id="status-section" className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-black italic">STATUS</h2>
          <div className="flex items-center space-x-2">
            {['Undetected', 'Updating', 'Use at Risk', 'Detected'].map(st => (
              <div key={st} className="flex items-center space-x-2 px-3 py-1 bg-white/5 rounded border border-white/10 text-[9px] font-black uppercase tracking-widest">
                <div className={`w-2 h-2 rounded-full ${st === 'Undetected' ? 'bg-hacker-green' : st === 'Updating' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <span>{st} (WORKING)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          <div>
            <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.3em] mb-6">APEX LEGENDS CHEATS</h3>
            <div className="space-y-2">
              {[
                { name: "REDEYE EXTERNAL", desc: "RedEye External delivers unparalleled movement mastery with auto-tap strafe, giving you a competitive edge.", status: "UPDATING", productId: "REDEYE_PROD_ID" },
                { name: "KERNAIM", desc: "Elite internal tool with perfect predictive aim and advanced visuals.", status: "UNDETECTED", productId: "KERNAIM_PROD_ID" },
                { name: "EDEN", desc: "Maximum security external build for professional league play.", status: "UNDETECTED", productId: "EDEN_PROD_ID" }
              ].map(tool => (
                <div key={tool.name} className="glass p-6 rounded-xl flex items-center justify-between group hover:border-hacker-green/30 transition-all">
                  <div className="flex-1">
                    <h4 className="text-xl font-black text-white group-hover:text-hacker-green transition-colors">{tool.name}</h4>
                    <p className="text-xs text-gray-500 max-w-2xl mt-1">{tool.desc}</p>
                  </div>
                  <div className="flex items-center space-x-12">
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-gray-600">UNDETECTED SINCE</div>
                      <div className="text-xs font-black">Windows 10 & 11</div>
                    </div>
                    <div className={`px-4 py-2 rounded text-[10px] font-black flex items-center gap-2 ${tool.status === 'UNDETECTED' ? 'bg-hacker-green/10 text-hacker-green border border-hacker-green/30' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'}`}>
                      <div className={`w-2 h-2 rounded-full ${tool.status === 'UNDETECTED' ? 'bg-hacker-green' : 'bg-yellow-500'}`} />
                      {tool.status} (WORKING)
                    </div>
                    <button
                      onClick={() => handlePurchase(tool.productId)}
                      className="px-6 py-2 bg-hacker-green text-black font-black text-xs rounded hover:shadow-[0_0_15px_rgba(0,255,0,0.5)] transition-all uppercase"
                    >
                      Purchase Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const DashboardShell = ({ children, title }) => (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Dashboard Sidebar */}
        <aside className="w-full md:w-64 space-y-6">
          <div className="p-6 glass rounded-2xl text-center space-y-4">
            <div className="w-20 h-20 bg-hacker-green rounded-full mx-auto flex items-center justify-center p-1 border-4 border-hacker-green/20">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-3xl font-black text-hacker-green">A</div>
            </div>
            <div>
              <div className="font-black text-xl">APEXE</div>
              <div className="text-[10px] font-bold text-hacker-green uppercase tracking-widest">Premium Member</div>
            </div>
          </div>

          <nav className="space-y-1">
            {['Overview', 'Licenses', 'Balance', 'Settings', 'Admin Panel'].map(item => (
              <button
                key={item}
                onClick={() => setView(item === 'Admin Panel' ? 'AdminDashboard' : 'UserDashboard')}
                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl font-black text-xs uppercase transition-all ${((item === 'Overview' && view === 'UserDashboard') || (item === 'Admin Panel' && view === 'AdminDashboard')) ? 'bg-hacker-green text-black shadow-[0_10px_20px_-5px_rgba(0,255,0,0.4)]' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
              >
                <ArrowRight size={14} />
                <span>{item}</span>
              </button>
            ))}
            <button
              onClick={() => setIsLoggedIn(false)}
              className="w-full flex items-center space-x-4 px-6 py-4 rounded-xl font-black text-xs uppercase text-red-500 hover:bg-red-500/5 transition-all mt-6"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Dashboard Content */}
        <main className="flex-1 space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase">{title}</h2>
            <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-500">
              <Activity size={14} className="text-hacker-green" />
              <span>LAST SYNC: JUST NOW</span>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );

  const UserDashboard = () => (
    <DashboardShell title="Account Overview">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={64} className="text-hacker-green" />
          </div>
          <div className="text-[10px] font-black text-hacker-green uppercase tracking-[0.2em] mb-4">MetaCredits</div>
          <div className="text-5xl font-black italic">${userBalance.toFixed(2)}</div>
          <button
            onClick={() => setShowDepositModal(true)}
            className="mt-8 w-full py-4 glass border border-hacker-green/20 text-hacker-green font-black text-[10px] uppercase tracking-widest hover:bg-hacker-green hover:text-black transition-all"
          >
            Add Funds via SellAuth
          </button>
        </div>
        <div className="glass p-8 rounded-2xl relative overflow-hidden group">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Active Keys</div>
          <div className="text-5xl font-black italic">03</div>
          <button className="mt-8 w-full py-4 glass border border-white/10 text-white/50 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all">Manage Licenses</button>
        </div>
        <div className="glass p-8 rounded-2xl relative overflow-hidden group">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Security ID</div>
          <div className="text-5xl font-black italic truncate">MC_99</div>
          <button className="mt-8 w-full py-4 glass border border-white/10 text-white/50 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all">HWID Reset</button>
        </div>
      </div>

      <div className="glass p-8 rounded-2xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-black uppercase italic tracking-wider">Your Licenses</h3>
          <span className="px-3 py-1 bg-hacker-green/10 text-hacker-green rounded text-[9px] font-bold border border-hacker-green/20 uppercase tracking-widest">Live Updates</span>
        </div>
        <div className="space-y-4">
          {[
            { name: "Apex Internal", key: "MC-928X-XXXX-8821", status: "STABLE", exp: "24 Days" },
            { name: "Rust Client", key: "MC-772L-XXXX-0012", status: "STABLE", exp: "2 Days" }
          ].map(lic => (
            <div key={lic.name} className="flex items-center justify-between p-6 bg-black/40 rounded-xl border border-white/5 hover:border-hacker-green/20 transition-all">
              <div className="flex gap-12 items-center">
                <div>
                  <div className="text-xs font-black text-white">{lic.name.toUpperCase()}</div>
                  <div className="text-[10px] text-gray-600 font-mono mt-1">{lic.key}</div>
                </div>
                <div className="px-3 py-1 bg-white/5 rounded text-[10px] font-black text-hacker-green border border-hacker-green/30">{lic.status}</div>
              </div>
              <div className="flex gap-8 items-center">
                <div className="text-right">
                  <div className="text-[9px] font-bold text-gray-600">REMAINING</div>
                  <div className="text-sm font-black italic">{lic.exp}</div>
                </div>
                <button className="p-3 glass rounded-lg border border-white/10 hover:bg-hacker-green hover:text-black transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );

  const AdminDashboard = () => (
    <DashboardShell title="Admin Command Center">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { l: "Revenue", v: "$12.4K", g: "+8%" },
          { l: "Users", v: "1,241", g: "+12%" },
          { l: "Tickets", v: "04", g: "-20%" },
          { l: "Uptime", v: "99.9%", g: "STABLE" }
        ].map(s => (
          <div key={s.l} className="glass p-6 rounded-xl border-t-2 border-t-hacker-green">
            <div className="text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">{s.l}</div>
            <div className="text-3xl font-black mt-2 italic">{s.v}</div>
            <div className="text-[9px] font-bold text-hacker-green mt-2">{s.g} FROM PREV</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="glass p-8 rounded-2xl">
          <h3 className="font-black uppercase italic mb-8">System Traffic</h3>
          <div className="space-y-4 font-mono text-[10px]">
            {[
              "12:44 > ROOT_AUTH[SUCCESS] IP: 45.12.11.22",
              "12:42 > SELLAUTH_WEBHOOK[POINT_GRANT] USER: SHADOW AMOUNT: 50.00",
              "12:40 > HWID_RESET[PENDING] KEY: MC-928X...",
              "12:38 > NEW_PRODUCT_UPLOAD: 'MetaCleaner v2.1'"
            ].map((log, i) => (
              <div key={i} className="flex gap-4 text-hacker-green/80 p-2 hover:bg-white/5 rounded transition-all">
                <span className="text-white opacity-20">{">"}</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass p-8 rounded-2xl">
          <h3 className="font-black uppercase italic mb-8">Management Controls</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setUserBalance(prev => prev + 50)}
              className="p-6 glass border border-hacker-green/30 text-hacker-green rounded-xl flex flex-col items-center gap-4 hover:bg-hacker-green hover:text-black transition-all group"
            >
              <Zap size={24} />
              <span className="text-[10px] font-black uppercase">Grant $50</span>
            </button>
            <button className="p-6 glass border border-white/10 rounded-xl flex flex-col items-center gap-4 hover:border-hacker-green transition-all">
              <User size={24} />
              <span className="text-[10px] font-black uppercase">User List</span>
            </button>
            <button className="p-6 glass border border-white/10 rounded-xl flex flex-col items-center gap-4 hover:border-hacker-green transition-all">
              <Database size={24} />
              <span className="text-[10px] font-black uppercase">SellAuth Sync</span>
            </button>
            <button className="p-6 glass border border-white/10 rounded-xl flex flex-col items-center gap-4 hover:border-hacker-green transition-all">
              <Settings size={24} />
              <span className="text-[10px] font-black uppercase">System config</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-hacker-green/30">
      <header className="fixed top-0 w-full z-50">
        {/* Top Meta Bar */}
        <div className="bg-black border-b border-white/5 py-2">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div
                onClick={() => setView('Home')}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <Shield className="text-hacker-green" size={18} />
                <span className="text-sm font-black tracking-tighter">METACHEATS</span>
              </div>
              <div className="flex items-center space-x-2 bg-hacker-green/5 px-2 py-0.5 rounded-full border border-hacker-green/20">
                <div className="w-1.5 h-1.5 rounded-full bg-hacker-green animate-pulse" />
                <span className="text-[9px] font-black text-hacker-green uppercase tracking-widest">37 Online</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.open('https://discord.gg/metacheats', '_blank')}
                className="flex items-center space-x-2 px-4 py-1.5 bg-[#5865F2] hover:bg-[#4752c4] rounded text-[10px] font-black uppercase transition-all"
              >
                <MessageSquare size={14} />
                <span>Discord</span>
              </button>
              <div className="h-4 w-px bg-white/10" />
              {!isLoggedIn ? (
                <>
                  <button onClick={() => handleLogin(false)} className="px-4 py-1.5 bg-white text-black hover:bg-gray-200 rounded text-[10px] font-black uppercase transition-all">Login</button>
                  <button onClick={() => handleLogin(true)} className="px-4 py-1.5 bg-[#5865F2] hover:bg-[#4752c4] rounded text-[10px] font-black uppercase transition-all">Register</button>
                </>
              ) : (
                <div className="flex items-center gap-6">
                  <button onClick={() => setView(isAdmin ? 'AdminDashboard' : 'UserDashboard')} className="text-[10px] font-black uppercase text-hacker-green flex items-center gap-2">
                    <User size={14} /> My Account
                  </button>
                  <button onClick={() => setIsLoggedIn(false)} className="text-red-500 hover:text-red-400 transition-colors">
                    <LogOut size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className={`transition-all duration-300 ${scrolled ? 'glass py-4' : 'bg-[#0a0a0a]/80 backdrop-blur-md py-6 border-b border-white/5'}`}>
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {navItems.map(item => (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.label === 'Accounts') setView('AccountsShop');
                    else if (item.label === 'Forums') setView('Forums');
                    else if (item.label === 'Support') setView('Support');
                    else if (item.label === 'Reviews') setView('Reviews');
                    else if (item.label === 'Status') {
                      setView('Home');
                      setTimeout(() => {
                        const el = document.getElementById('status-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }
                    else setView('Home');
                  }}
                  className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-hacker-green transition-all group"
                >
                  <span className="text-hacker-green/30 group-hover:text-hacker-green transition-colors">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center flex-1 max-w-sm ml-12">
              <div className="w-full relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/20 group-focus-within:text-hacker-green/50">
                  <Search size={14} />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-white/5 border border-white/10 rounded py-2 pl-10 pr-4 text-[10px] font-bold focus:outline-none focus:border-hacker-green/50 focus:bg-hacker-green/5 transition-all text-white placeholder-white/20 uppercase tracking-widest"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {view === 'Home' && <LandingView />}
          {view === 'AccountsShop' && <AccountsShopView />}
          {view === 'Forums' && <ForumsView />}
          {view === 'Support' && <SupportView />}
          {view === 'Reviews' && <ReviewsView />}
          {view === 'Legal' && <LegalView />}
          {(view === 'UserDashboard' || view === 'AdminDashboard' || view === 'Overview' || view === 'Licenses' || view === 'Balance' || view === 'Settings') && (
            isAdmin ? <AdminDashboard /> : <UserDashboard />
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showDepositModal && <DepositModal />}
      </AnimatePresence>

      <footer className="bg-black border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="text-hacker-green" size={24} />
            <span className="text-2xl font-black italic tracking-tighter uppercase">META<span className="text-hacker-green">CHEATS</span></span>
          </div>
          <div className="flex justify-center space-x-12">
            {['Products', 'Pricing', 'Status', 'FAQ', 'Legal'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-white transition-all">{item}</a>
            ))}
          </div>
          <p className="text-[10px] font-bold text-gray-700 tracking-[0.3em]">© 2026 METACHEATS - ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
};

export default MetaCheats;
