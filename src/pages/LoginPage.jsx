import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SellAuth } from '../lib/sellauth';
import { useAuth } from '../AuthContext';
import MouseGlow from '../components/MouseGlow';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await SellAuth.login(email, password);
            if (data.token) {
                login(data.user, data.token);
                navigate('/account');
            } else {
                setError(data.error || 'Invalid credentials');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent selection-blue flex items-center justify-center px-4 relative">
            <MouseGlow />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass border border-white/10 p-8 rounded-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <img src="/logo.png" alt="Meta Cheats" className="h-20 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]" />
                    <h1 className="text-2xl font-black uppercase tracking-[0.2em] mb-2">Welcome Back</h1>
                    <p className="text-muted text-[10px] font-bold uppercase tracking-widest">Login to access your orders and keys</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" size={16} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-accent/50 transition-all"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" size={16} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-accent/50 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-black font-black uppercase tracking-[0.2em] py-4 rounded-xl hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : (
                            <>
                                Sign In
                                <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                        Don't have an account? {' '}
                        <Link to="/register" className="text-accent hover:text-white transition-colors">Create one now</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
