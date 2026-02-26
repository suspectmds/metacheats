import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Send, X, ChevronRight } from 'lucide-react';

const ForumView = ({ selectedThread, setSelectedThread }) => {
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
                        <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">TACTICAL <span className="text-emerald-400">FORUMS</span></h2>
                        <p className="text-white/30 text-xs font-bold uppercase tracking-widest mt-4">Encrypted Community Comms</p>
                    </div>
                    <button onClick={() => setShowNewThreadModal(true)} className="px-8 py-4 bg-emerald-500 text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(52,211,153,0.3)]">New Briefing</button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {threads.map(t => (
                        <div key={t.id} onClick={() => setSelectedThread(t)} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group pointer-events-auto">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-6">
                                    <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-white/30 font-black">{t.author.charAt(0)}</div>
                                    <div>
                                        <h3 className="text-xl font-black italic text-white uppercase group-hover:text-emerald-400 transition-colors">{t.title}</h3>
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
                            <h3 className="text-3xl font-black italic text-white uppercase mb-8">Start <span className="text-emerald-400">Discussion</span></h3>
                            <form onSubmit={handleNewThreadSubmit} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 block">Briefing Title</label>
                                    <input name="title" required className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white text-sm focus:border-emerald-500 outline-none" placeholder="Target system..." />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 block">Content</label>
                                    <textarea name="content" required rows={6} className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white text-sm focus:border-emerald-500 outline-none" placeholder="Details..." />
                                </div>
                                <button type="submit" className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-emerald-500 transition-all shadow-xl">Deploy Thread</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        );
    } else {
        return (
            <div className="pt-48 pb-32 max-w-5xl mx-auto px-6 min-h-screen relative z-10">
                <button onClick={() => setSelectedThread(null)} className="flex items-center space-x-3 text-white/30 hover:text-emerald-400 transition-colors font-black uppercase text-[10px] tracking-widest mb-12 pointer-events-auto">
                    <ArrowLeft size={14} /> <span>Back to Index</span>
                </button>

                <div className="bg-white/5 border border-white/10 rounded-[48px] p-12 md:p-20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-emerald-400/20" />
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

                        <form onSubmit={handleReplySubmit} className="mt-16 md:ml-20 border-t border-white/10 pt-12">
                            <label className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center space-x-3"><MessageSquare size={16} /><span>Post a Reply</span></label>
                            <textarea name="reply" required rows={4} className="w-full bg-black/50 border border-white/10 rounded-3xl p-6 text-white text-sm focus:outline-none focus:border-emerald-400 transition-all custom-scrollbar mb-6 shadow-inner" placeholder="Contribute to the discussion..." />
                            <div className="flex justify-end">
                                <button type="submit" className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-emerald-500 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center space-x-2">
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

export default ForumView;
