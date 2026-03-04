import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Key, Download, ExternalLink, LogOut, ShieldCheck, Clock, CheckCircle, ChevronRight, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SellAuth } from '../lib/sellauth';
import { useAuth } from '../AuthContext';
import MouseGlow from '../components/MouseGlow';

const AccountPage = () => {
    const { user, token, logout, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (token) {
                const data = await SellAuth.getUserOrders(token);
                setOrders(data.orders || []);
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        // Simple visual feedback could go here
    };

    if (authLoading || !user) return null;

    return (
        <div className="min-h-screen bg-transparent selection-blue pt-32 pb-20 px-6 relative">
            <MouseGlow />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-black uppercase tracking-[0.3em] mb-2"
                        >
                            My <span className="text-accent">Account</span>
                        </motion.h1>
                        <p className="text-muted text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck size={14} className="text-accent" /> Authenticated as: {user.email}
                        </p>
                    </div>
                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500 transition-all"
                    >
                        Sign Out <LogOut size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Orders List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-muted mb-4 flex items-center gap-2">
                            <Package size={16} /> Purchase History
                        </h2>

                        {loading ? (
                            <div className="glass rounded-2xl p-12 text-center border border-white/5 animate-pulse">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted">Retrieving order secure stream...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="glass rounded-2xl p-12 text-center border border-white/5">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-6">No orders found for this account</p>
                                <button
                                    onClick={() => navigate('/store')}
                                    className="px-8 py-3 bg-accent text-black font-black uppercase tracking-widest rounded-lg text-[10px] hover:shadow-glow transition-all"
                                >
                                    Visit Store
                                </button>
                            </div>
                        ) : (
                            orders.map((order, idx) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`glass rounded-2xl border transition-all overflow-hidden ${expandedOrder === order.id ? 'border-accent/30 ring-1 ring-accent/20' : 'border-white/5 hover:border-white/10'}`}
                                >
                                    <div
                                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                        className="p-6 cursor-pointer flex items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                                <Package className="text-accent" size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black uppercase tracking-wider mb-1 line-clamp-1">
                                                    {order.items[0]?.product_name || 'Premium Service'}
                                                </h3>
                                                <div className="flex items-center gap-3 text-[10px] font-bold text-muted uppercase tracking-widest">
                                                    <span className="flex items-center gap-1"><Clock size={12} /> {new Date(order.created_at).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1 text-accent"><CheckCircle size={12} /> {order.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center gap-4">
                                            <div className="hidden sm:block">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">Total Paid</p>
                                                <p className="text-sm font-black text-white">£{order.total}</p>
                                            </div>
                                            <ChevronRight className={`transition-transform duration-300 ${expandedOrder === order.id ? 'rotate-90' : ''}`} />
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {expandedOrder === order.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-white/5 bg-white/[0.02]"
                                            >
                                                <div className="p-6 space-y-6">
                                                    {order.items.map((item, i) => (
                                                        <div key={i} className="space-y-4">
                                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-1">Product License</p>
                                                                    <p className="text-xs font-bold uppercase tracking-wider">{item.product_name} - {item.variant_name}</p>
                                                                </div>
                                                                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                                                                    Download <Download size={14} />
                                                                </button>
                                                            </div>

                                                            {item.keys && item.keys.length > 0 && (
                                                                <div className="space-y-2">
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Delivered Keys:</p>
                                                                    {item.keys.map((key, ki) => (
                                                                        <div key={ki} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-[11px] text-accent/80">
                                                                            <span className="truncate">{key}</span>
                                                                            <button onClick={() => handleCopy(key)} className="hover:text-white transition-colors">
                                                                                <Copy size={14} />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-8">
                        {/* Account Summary */}
                        <div className="glass rounded-2xl p-6 border border-white/5">
                            <h3 className="text-[12px] font-black uppercase tracking-[0.3em] mb-6">Overview</h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted">Total Orders</span>
                                    <span className="text-lg font-black">{orders.length}</span>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted">Membership</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-accent">Premium Member</span>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="glass rounded-2xl p-6 border border-accent/20 bg-accent/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={80} />
                            </div>
                            <h3 className="text-[12px] font-black uppercase tracking-[0.3em] mb-4 relative z-10">Need Help?</h3>
                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-relaxed mb-6 relative z-10">
                                Our support team is available 24/7 on Discord to assist with your keys or downloads.
                            </p>
                            <a
                                href="https://discord.gg/metacheats"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 bg-white text-black font-black uppercase tracking-widest rounded-lg text-[10px] hover:bg-accent transition-all relative z-10 flex items-center justify-center"
                            >
                                Join Discord & Create Ticket
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
