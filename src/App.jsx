import React, { useState, useEffect } from 'react';
import { ShoppingCart, LayoutGrid, Info, MessageSquare, Twitter, Instagram, Youtube, CreditCard, ShieldCheck, ChevronDown, Star, Quote } from 'lucide-react';
import { SellAuth } from './lib/sellauth';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen.jsx';
import MouseGlow from './components/MouseGlow.jsx';

const App = () => {
    const [showSplash, setShowSplash] = useState(true);
    const [currency, setCurrency] = useState('GBP');
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const [dynamicGroups, setDynamicGroups] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [checkoutLoading, setCheckoutLoading] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const [products, groups, reviews] = await Promise.all([
                SellAuth.getProducts(),
                SellAuth.getGroups(),
                SellAuth.getFeedbacks()
            ]);

            // Group products by group_id
            const structured = groups.map(g => ({
                name: g.name,
                items: products
                    .filter(p => String(p.group_id) === String(g.id))
                    .map(p => ({ id: p.id, name: p.name }))
            })).filter(g => g.items.length > 0);

            // Handle solo products
            const groupedIds = new Set(structured.flatMap(g => g.items.map(i => i.id)));
            const solo = products.filter(p => !groupedIds.has(p.id));
            if (solo.length > 0) {
                structured.push({
                    name: 'Miscellaneous',
                    items: solo.map(p => ({ id: p.id, name: p.name }))
                });
            }

            setDynamicGroups(structured);
            setFeedbacks(reviews.length > 0 ? reviews : [
                { rating: 5, comment: "Undetected for months. Best support in the scene.", customer_email: "v***@nexus.com" },
                { rating: 5, comment: "Supreme performance on R6. Highly recommend.", customer_email: "d***@apex.io" },
                { rating: 5, comment: "Fast delivery and easy setup. The guides are a lifesaver.", customer_email: "k***@pulse.net" }
            ]);
        };
        fetchData();
    }, []);

    const handleQuickPurchase = (productId) => {
        setCheckoutLoading(productId);
        window.open(`https://metacheats.mysellauth.com/p/${productId}`, '_blank');
        setTimeout(() => setCheckoutLoading(null), 1500);
    };

    return (
        <div className="selection-blue">
            <MouseGlow />
            <AnimatePresence>
                {showSplash && (
                    <SplashScreen onComplete={() => setShowSplash(false)} />
                )}
            </AnimatePresence>

            {!showSplash && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-screen bg-transparent"
                >
                    {/* Premium Navbar */}
                    <nav className="fixed top-0 left-0 right-0 z-50 glass h-20 px-6 flex items-center justify-between border-b border-white/5">
                        {/* Brand/Logo */}
                        <div className="flex items-center gap-3 w-1/4">
                            <img src="/logo.png" alt="Meta Cheats" className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                            <span className="text-lg font-black tracking-tighter hidden lg:block uppercase text-accent" style={{ textShadow: '0 0 15px rgba(34, 197, 94, 0.8)' }}>META CHEATS</span>
                        </div>

                        {/* Top Middle Navigation */}
                        <div className="hidden md:flex items-center justify-center gap-6 text-[10px] font-black text-muted flex-grow uppercase tracking-[0.3em]">
                            <a href="/" className="hover:text-accent hover:text-glow transition-all">Home</a>
                            <Link to="/store" className="hover:text-accent hover:text-glow transition-all">Store</Link>
                            <a href="#reviews" className="hover:text-accent hover:text-glow transition-all">Reviews</a>
                            <a href="#" className="hover:text-accent hover:text-glow transition-all">Discord</a>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center justify-end gap-6 w-1/4">
                            <div className="hidden lg:flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
                                <a href="#" className="text-muted hover:text-white transition-colors">Login</a>
                            </div>

                            <div className="flex items-center gap-4">
                                <button className="relative p-2 text-muted hover:text-accent hover:text-glow transition-all">
                                    <ShoppingCart size={20} />
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-[9px] text-white flex items-center justify-center rounded-sm font-black accent-glow">0</span>
                                </button>

                                {/* Currency Selector */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-lg text-[10px] font-black hover:border-accent/40 transition-all uppercase tracking-widest"
                                    >
                                        {currency}
                                        <ChevronDown size={14} className={`transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isCurrencyOpen && (
                                        <div className="absolute top-full right-0 mt-2 w-24 glass rounded-xl border border-white/10 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                                            {['GBP', 'USD', 'EUR'].map((curr) => (
                                                <button
                                                    key={curr}
                                                    onClick={() => {
                                                        setCurrency(curr);
                                                        setIsCurrencyOpen(false);
                                                    }}
                                                    className="w-full px-4 py-2.5 text-left text-[10px] font-black hover:bg-accent/20 transition-colors uppercase tracking-widest text-muted hover:text-white"
                                                >
                                                    {curr}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Hero Section */}
                    <section className="pt-48 pb-24 px-6 max-w-7xl mx-auto relative">
                        <div className="text-center mb-24">
                            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none">
                                SUPREME <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-white to-brandPurple text-glow" style={{ WebkitTextStroke: '1px rgba(34, 197, 94, 0.2)' }}>DOMINANCE</span><br />
                                PRO CHEATS.
                            </h1>
                            <p className="text-muted text-sm md:text-base max-w-2xl mx-auto mb-12 font-bold uppercase tracking-[0.2em] opacity-80">
                                DOMINATE EVERY ARENA WITH THE MOST UNDETECTED CHEATS ON THE MARKET.
                                PRO-GRADE PERFORMANCE AND DEDICATED 24-HOUR SUPPORT FOR UNSTOPPABLE PLAY.
                            </p>

                            {/* Live Status Indicators */}
                            <div className="flex flex-wrap items-center justify-center gap-4 mb-12 animate-in fade-in zoom-in duration-1000">
                                {[
                                    { name: 'Apex Legends', status: 'Undetected' },
                                    { name: 'R6 Siege', status: 'Undetected' },
                                    { name: 'Fortnite', status: 'Undetected' },
                                    { name: 'Live Users', status: '1,429' }
                                ].map((stat, i) => (
                                    <div key={i} className="glass px-4 py-2 rounded-full border border-white/5 flex items-center gap-2 group hover:border-accent/40 transition-all cursor-default">
                                        <div className={`w-1.5 h-1.5 rounded-full ${stat.name === 'Live Users' ? 'bg-brandPurple animate-pulse' : 'bg-accent animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]'}`} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-white transition-colors">{stat.name}:</span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${stat.name === 'Live Users' ? 'text-brandPurple' : 'text-accent'}`}>{stat.status}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Link to="/store" className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-accent to-brandPurple text-white font-black uppercase tracking-[0.3em] rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-[0_0_40px_rgba(34,197,94,0.5)] border border-white/20">
                                    Explore Store
                                    <ShoppingCart size={20} />
                                </Link>
                                <a href="#reviews" className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-white/10 transition-all hover:border-accent/40 flex items-center justify-center">
                                    Reviews
                                </a>
                            </div>
                        </div>

                        {/* Feature Grid (Bento Style) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32 relative z-10">
                            <div className="md:col-span-2 glass p-10 rounded-[3rem] group hover:border-accent/40 transition-all relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <ShieldCheck className="text-accent mb-6 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]" size={48} />
                                <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter italic">Most Undetected</h3>
                                <p className="text-muted leading-relaxed font-bold text-sm uppercase tracking-wide opacity-70">
                                    Our cheats are engineered for maximum stealth. We employ advanced kernel-level protection and signature randomization to ensure you remain completely undetected.
                                </p>
                            </div>
                            <div className="glass p-10 rounded-[3rem] group hover:border-accent/40 transition-all relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <MessageSquare className="text-accent mb-6 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]" size={48} />
                                <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter italic">24-Hour Access</h3>
                                <p className="text-muted leading-relaxed font-bold text-sm uppercase tracking-wide opacity-70">
                                    Pro gaming 24-hour cheats for sale. Our dedicated team and automated systems ensure you have access to dominance every single hour of the day.
                                </p>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        {feedbacks.length > 0 && (
                            <div id="reviews" className="mb-32 scroll-mt-24">
                                <div className="flex items-center gap-4 mb-12">
                                    <div className="h-px w-20 bg-accent/30"></div>
                                    <h3 className="text-3xl font-black italic uppercase tracking-tighter">Verified <span className="text-accent text-glow">Feedbacks</span></h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {feedbacks.map((fb, i) => (
                                        <div key={i} className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-accent/20 transition-all group relative">
                                            <Quote className="absolute top-6 right-8 text-white/5 group-hover:text-accent/10 transition-colors" size={40} />
                                            <div className="flex gap-1 mb-4">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} className={i < fb.rating ? "text-accent fill-accent shadow-glow" : "text-white/10"} />
                                                ))}
                                            </div>
                                            <p className="text-sm font-medium text-muted line-clamp-3 mb-6 italic">"{fb.comment || "Premium service, highly recommend!"}"</p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-black text-accent uppercase">
                                                    {fb.customer_email?.[0] || 'A'}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-white">{fb.customer_email?.split('@')[0] || 'Anonymous'}</p>
                                                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted">Verified Customer</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Master Layout: Product Information Grid */}
                        <div className="glass p-12 md:p-16 rounded-[4rem] border border-white/10 relative overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent pointer-events-none" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                                {dynamicGroups.slice(0, 3).map((group, gIdx) => (
                                    <div key={gIdx} className={gIdx > 0 ? "pt-14 lg:pt-14" : ""}>
                                        {gIdx === 0 && (
                                            <h4 className="text-white font-bold mb-8 flex items-center gap-2">
                                                <LayoutGrid size={20} className="text-accent drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                                Product Information
                                            </h4>
                                        )}
                                        <ul className="space-y-3">
                                            {group.items.map((item, idx) => (
                                                <li
                                                    key={idx}
                                                    onClick={() => handleQuickPurchase(item.id)}
                                                    className="flex items-center gap-2.5 text-muted hover:text-accent transition-colors cursor-pointer text-sm group/item"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover/item:bg-accent group-hover/item:scale-125 transition-all" />
                                                    {item.name}
                                                    {checkoutLoading === item.id && <span className="text-[8px] animate-pulse">...</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}

                                <div>
                                    <h4 className="text-white font-bold mb-8">Important Information</h4>
                                    <ul className="space-y-3 mb-12">
                                        {["Customer Support", "Terms of Service", "Refund Policy", "Privacy Policy", "Shipping Policy"].map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-2.5 text-muted hover:text-white transition-colors cursor-pointer text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="text-sm">
                                        <p className="text-muted mb-2">For all other inquiries, contact:</p>
                                        <a href="mailto:admin@metacheats.com" className="text-white hover:text-accent transition-colors">admin@metacheats.com</a>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Ribbon */}
                            <div className="mt-20 pt-12 border-t border-white/5 flex flex-wrap items-center justify-between gap-8">
                                <div className="flex flex-wrap items-center gap-8 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-5" alt="Visa" />
                                    <div className="flex items-center gap-2 text-lg font-bold">
                                        <CreditCard size={20} /> mastercard
                                    </div>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-5" alt="PayPal" />
                                    <div className="text-lg font-bold">venmo</div>
                                    <div className="text-lg font-bold italic">Zelle</div>
                                    <div className="flex items-center gap-2 text-lg font-bold">
                                        <span className="w-6 h-6 bg-white text-background flex items-center justify-center rounded">S</span> Cash App
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Youtube size={20} /> <Twitter size={20} /> <Instagram size={20} /> <MessageSquare size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="py-12 px-6 border-t border-white/5">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="text-sm text-muted">
                                <p className="mb-1">Contact Us</p>
                                <p>POWERED BY INVISION COMMUNITY</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-white/5 rounded-lg hover:bg-accent/20 transition-all cursor-pointer group">
                                    <Instagram size={20} className="text-muted group-hover:text-accent group-hover:text-glow" />
                                </div>
                                <div className="p-2.5 bg-white/5 rounded-lg hover:bg-accent/20 transition-all cursor-pointer group">
                                    <Youtube size={20} className="text-muted group-hover:text-accent group-hover:text-glow" />
                                </div>
                                <div className="p-2.5 bg-white/5 rounded-lg hover:bg-accent/20 transition-all cursor-pointer group">
                                    <MessageSquare size={20} className="text-muted group-hover:text-accent group-hover:text-glow" />
                                </div>
                                <div className="p-2.5 bg-white/5 rounded-lg hover:bg-accent/20 transition-all cursor-pointer group">
                                    <Twitter size={20} className="text-muted group-hover:text-accent group-hover:text-glow" />
                                </div>
                            </div>
                        </div>
                    </footer>
                </motion.div>
            )}
        </div>
    );
};

export default App;
