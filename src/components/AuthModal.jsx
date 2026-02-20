import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Shield, X, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase, checkConfig } from '../lib/supabase';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [confirmationSent, setConfirmationSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const config = checkConfig();
        if (!config.isConfigured) {
            setError(`CRITICAL: Environment variables not detected. Expected 'VITE_SUPABASE_URL' and 'VITE_SUPABASE_ANON_KEY' in Vercel.`);
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onAuthSuccess(data.user);
                onClose();
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: window.location.origin,
                    }
                });
                if (error) throw error;
                setConfirmationSent(true);
            }
        } catch (err) {
            console.error("Auth Exception:", err);
            setError(err.message === "Failed to fetch"
                ? "Failed to connect to Database. Please verify VITE_SUPABASE_URL is correct."
                : err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="glass border border-hacker-green/20 w-full max-w-md p-8 rounded-3xl relative overflow-hidden"
                >
                    {/* Close Button */}
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>

                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 bg-hacker-green/10 rounded-2xl flex items-center justify-center text-hacker-green border border-hacker-green/20 mb-4">
                            <Shield size={32} />
                        </div>
                        <h2 className="text-3xl font-black italic tracking-tighter uppercase">
                            {confirmationSent ? 'Check Your Email' : isLogin ? 'Access Granted' : 'Create Identity'}
                        </h2>
                        <p className="text-gray-500 text-xs mt-2 font-bold uppercase tracking-widest leading-relaxed">
                            {confirmationSent
                                ? 'We have sent a verification secure link'
                                : isLogin ? 'Initialize secure portal session' : 'Register your credentials in the database'}
                        </p>
                    </div>

                    {confirmationSent ? (
                        <div className="flex flex-col items-center text-center space-y-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-hacker-green bg-hacker-green/5 p-4 rounded-full border border-hacker-green/20"
                            >
                                <CheckCircle size={48} />
                            </motion.div>
                            <div className="space-y-2">
                                <p className="text-gray-300 text-sm">Please check <b>{email}</b> to verify your identity.</p>
                                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter">You must confirm your account before you can start purchasing products.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-hacker-green text-black font-black uppercase text-xs rounded-xl shadow-[0_0_20px_rgba(0,255,0,0.2)] hover:shadow-[0_0_30px_rgba(0,255,0,0.4)] transition-all"
                            >
                                Return to Site
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-hacker-green transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="operator@metacheats.org"
                                        className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-hacker-green/40 transition-all placeholder:text-gray-700 font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Secure Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-hacker-green transition-colors" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-hacker-green/40 transition-all placeholder:text-gray-700 font-bold"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500 text-xs font-bold animate-shake">
                                    <X size={16} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 py-4 bg-hacker-green text-black font-black uppercase text-xs rounded-xl shadow-[0_0_20px_rgba(0,255,0,0.2)] hover:shadow-[0_0_30px_rgba(0,255,0,0.4)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : isLogin ? 'Enter Portal' : 'Finalize Registration'}
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div className="pt-6 text-center">
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-hacker-green transition-colors"
                                >
                                    {isLogin ? "Don't have an identity profile? Register" : "Already registered? Sign in"}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Matrix Pattern Overlay */}
                    <div className="absolute inset-0 z-[-1] opacity-5 pointer-events-none">
                        <div className="w-full h-full matrix-bg" />
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
