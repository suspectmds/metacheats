import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Bitcoin, Share2, X, Check, Copy, AlertCircle, ArrowRight } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, product }) => {
    const [step, setStep] = useState(1); // 1: Method, 2: Payment, 3: Verification
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [copied, setCopied] = useState(false);

    const paymentMethods = [
        { id: 'ltc', name: 'Litecoin (LTC)', icon: <Bitcoin className="text-blue-400" />, addr: 'Lhw9K8J...v7p2q', hint: 'Fastest & Lowest Fees' },
        { id: 'btc', name: 'Bitcoin (BTC)', icon: <Bitcoin className="text-yellow-500" />, addr: 'bc1qxy2...w9rvp', hint: 'Network fees may apply' },
        { id: 'cashapp', name: 'CashApp', icon: <Share2 className="text-green-500" />, addr: '$MetaPayment', hint: 'Manual verification required' },
    ];

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen || !product) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass border border-hacker-green/20 w-full max-w-lg p-8 rounded-3xl relative overflow-hidden"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20} /></button>

                    {/* Stepper Header */}
                    <div className="flex items-center justify-between mb-8 px-4">
                        {[1, 2, 3].map(s => (
                            <div key={s} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${step >= s ? 'border-hacker-green bg-hacker-green/20 text-hacker-green shadow-[0_0_10px_rgba(0,255,0,0.2)]' : 'border-white/10 text-gray-600'}`}>{s}</div>
                                {s < 3 && <div className={`w-12 h-px mx-2 ${step > s ? 'bg-hacker-green' : 'bg-white/10'}`} />}
                            </div>
                        ))}
                    </div>

                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter">Select <span className="text-hacker-green">Method</span></h2>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Purchasing: {product.name}</p>
                                <div className="text-3xl font-black text-white mt-4">${product.price || "19.99"}</div>
                            </div>
                            <div className="space-y-3">
                                {paymentMethods.map(m => (
                                    <button
                                        key={m.id}
                                        onClick={() => { setSelectedMethod(m); setStep(2); }}
                                        className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-hacker-green/30 hover:bg-hacker-green/5 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">{m.icon}</div>
                                            <div className="text-left">
                                                <div className="text-sm font-black text-gray-200 group-hover:text-white">{m.name}</div>
                                                <div className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">{m.hint}</div>
                                            </div>
                                        </div>
                                        <ArrowRight size={16} className="text-gray-700 group-hover:text-hacker-green group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && selectedMethod && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            <div className="text-center">
                                <div className="text-xs font-black text-hacker-green uppercase tracking-[0.2em] mb-2">Send Payment To</div>
                                <div className="inline-block p-4 bg-white rounded-2xl mb-4">
                                    <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center text-black text-[10px]">QR Placeholder</div>
                                </div>
                            </div>

                            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-3">
                                <div className="flex justify-between items-center text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                    <span>{selectedMethod.name} Address</span>
                                    {copied && <span className="text-hacker-green animate-pulse">Copied to Clipboard</span>}
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-1 font-mono text-xs text-white truncate items-center flex">{selectedMethod.addr}</div>
                                    <button onClick={() => handleCopy(selectedMethod.addr)} className="p-3 bg-white/5 rounded-xl hover:text-hacker-green transition-colors"><Copy size={16} /></button>
                                </div>
                            </div>

                            <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded-xl flex gap-3 italic">
                                <AlertCircle className="text-yellow-500 shrink-0" size={18} />
                                <p className="text-[10px] text-yellow-500/80 font-bold leading-relaxed">System takes 1-3 network confirmations. Once sent, click verify below to finalize your delivery order.</p>
                            </div>

                            <button
                                onClick={() => setStep(3)}
                                className="w-full py-4 bg-hacker-green text-black font-black uppercase text-xs rounded-xl shadow-[0_0_20px_rgba(0,255,0,0.2)] hover:shadow-[0_0_30px_rgba(0,255,0,0.4)] transition-all"
                            >
                                I have Sent the Payment
                            </button>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center space-y-6 py-4">
                            <div className="w-20 h-20 bg-hacker-green/10 rounded-full flex items-center justify-center text-hacker-green border-4 border-hacker-green/20 mx-auto animate-pulse">
                                <Check size={40} />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black italic uppercase">Verification <span className="text-hacker-green">Pending</span></h2>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Order ID: #{Math.floor(Math.random() * 900000 + 100000)}</p>
                            </div>
                            <div className="text-sm text-gray-300 px-4 leading-relaxed">
                                Your payment is being confirmed on the blockchain. Once verified, your product will be delivered to <b>your registered email</b> and your dashboard licenses.
                            </div>
                            <button
                                onClick={onClose}
                                className="w-full py-4 border border-white/10 text-white font-black uppercase text-xs rounded-xl hover:bg-white/5 transition-all mt-4"
                            >
                                Close and Monitor Status
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CheckoutModal;
