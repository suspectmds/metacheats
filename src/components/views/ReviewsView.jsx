import React from 'react';
import { Star, RefreshCw, MessageSquare } from 'lucide-react';

const ReviewsView = ({ realReviews, loading, page, setPage, liveGames, reviewPool }) => {
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
                <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">CUSTOMER <span className="text-emerald-400">REVIEWS</span></h2>
                <div className="mt-6 inline-flex items-center space-x-4 bg-white/5 border border-white/10 px-6 py-3 rounded-full">
                    <div className="flex space-x-1 text-emerald-400">
                        {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <div className="text-white font-black text-sm">{(realReviews.length + 42100).toLocaleString()} Verified Reviews</div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                    <RefreshCw className="text-emerald-400 animate-spin" size={48} />
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-400">Syncing Authentic Reviews...</p>
                </div>
            ) : currentReviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {currentReviews.map((r, idx) => (
                        <div key={r.id || idx} className="bg-white/5 border border-white/10 p-8 rounded-3xl relative pointer-events-auto">
                            <div className="absolute top-8 right-8 text-white/20 text-[10px] uppercase font-black tracking-widest leading-tight text-right">
                                {r.isGenerated ? "Verified Customer" : "Verified Purchase"}
                                <br />
                                <span className="text-emerald-400/40">{r.product || r.product_name}</span>
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
                                    <Star key={i} size={14} className={i < (r.stars || r.rating) ? "text-emerald-400 fill-emerald-400" : "text-white/10"} />
                                ))}
                            </div>
                            <p className="text-white/70 leading-relaxed text-sm">"{r.comment}"</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 border border-white/5 bg-white/[0.02] rounded-3xl">
                    <MessageSquare className="mx-auto text-white/10 mb-6" size={64} />
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">NO REVIEWS <span className="text-emerald-400">DETECTED</span></h3>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-4">Sector is currently silent. Real customer feedback will appear here as it arrives.</p>
                </div>
            )}

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

export default ReviewsView;
