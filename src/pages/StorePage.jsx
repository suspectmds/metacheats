import React, { useState, useEffect } from 'react';
import { ShoppingCart, ArrowLeft, Loader2, ArrowRight, ChevronRight, X, Check, ExternalLink } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MouseGlow from '../components/MouseGlow.jsx';
import { SellAuth } from '../lib/sellauth.js';

const STORE_URL = 'https://metacheat.org';

// Strip HTML tags from description strings
const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim();
};

const GROUP_ICONS = {
    default: '🎮', 'rainbow': '🌈', 'r6': '🎯', 'siege': '🎯',
    'apex': '🔵', 'fortnite': '🏆', 'valorant': '🟥',
    'rust': '🏚️', 'warzone': '💀', 'pubg': '🪂',
    'spoofer': '🛡️', 'hwid': '🛡️', 'dma': '⚡', 'boost': '📈',
};
const getGroupIcon = (name = '') => {
    const lower = name.toLowerCase();
    for (const [key, icon] of Object.entries(GROUP_ICONS)) {
        if (lower.includes(key)) return icon;
    }
    return GROUP_ICONS.default;
};

// ─── Product Modal ─────────────────────────────────────────────────────────────
const ProductModal = ({ product, description, onClose }) => {
    const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);

    const [checkingOut, setCheckingOut] = useState(false);

    const handleCheckout = async () => {
        if (!selectedVariant || checkingOut) return;
        setCheckingOut(true);
        // Fallback: mysellauth product page
        const slug = product.path || product.slug || product.id;
        const fallbackUrl = `https://metacheat.mysellauth.com/product/${slug}?variant=${selectedVariant.id}`;
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.id,
                    variantId: selectedVariant.id
                })
            });

            const data = await res.json();

            if (res.ok && data.url) {
                window.location.href = data.url;
            } else {
                console.error("Direct checkout failed:", data.error);
                window.location.href = fallbackUrl;
            }
        } catch (err) {
            console.error("Fetch error during checkout:", err);
            window.location.href = fallbackUrl;
        } finally {
            setCheckingOut(false);
        }
    };

    const image = product.images?.[0]?.url || product.image_url || null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#08080A]/90 backdrop-blur-md"
                onClick={onClose}
            />
            {/* Modal */}
            <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25 }}
                className="glass w-full max-w-2xl rounded-[3rem] border border-white/10 overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Image header */}
                {image && (
                    <div className="aspect-video w-full relative overflow-hidden flex-shrink-0">
                        <img src={image} alt={product.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
                    </div>
                )}

                <div className="p-8 flex flex-col gap-6 overflow-y-auto">
                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 p-2 hover:bg-white/10 rounded-full transition-colors text-muted hover:text-white z-20"
                    >
                        <X size={22} />
                    </button>

                    {/* Title */}
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-2">{product.name}</h2>
                        {description && (
                            <p className="text-muted text-sm leading-relaxed font-medium">{description}</p>
                        )}
                    </div>

                    {/* Plan Selector */}
                    {product.variants?.length > 0 && (
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-3">Select Your Plan</p>
                            <div className="grid grid-cols-1 gap-3">
                                {product.variants.map((v) => {
                                    const isSelected = selectedVariant?.id === v.id;
                                    const stock = v.stock_count ?? v.stock;
                                    return (
                                        <button
                                            key={v.id}
                                            onClick={() => setSelectedVariant(v)}
                                            className={`flex items-center justify-between px-5 py-4 rounded-2xl border transition-all text-left ${isSelected
                                                ? 'bg-accent/15 border-accent shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                                                : 'bg-white/5 border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-accent bg-accent' : 'border-white/30'}`}>
                                                    {isSelected && <Check size={12} className="text-black font-black" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black uppercase tracking-wider">
                                                        {v.name || v.title || v.label || `Plan ${product.variants.indexOf(v) + 1}`}
                                                    </p>
                                                    {stock != null && stock < 999990 && (
                                                        <p className="text-[10px] text-muted uppercase tracking-widest">{stock} in stock</p>
                                                    )}
                                                </div>
                                            </div>
                                            {v.price && (
                                                <p className="text-xl font-black text-white" style={{ textShadow: '0 0 15px rgba(34,197,94,0.5)' }}>
                                                    ${parseFloat(v.price).toFixed(2)}
                                                    <span className="text-[10px] text-muted font-bold ml-1">USD</span>
                                                </p>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Checkout Button */}
                    <button
                        onClick={handleCheckout}
                        className="w-full py-5 bg-gradient-to-r from-accent to-brandPurple text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                    >
                        <ExternalLink size={18} />
                        Proceed to Checkout
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// ─── Main Store Page ────────────────────────────────────────────────────────────
const StorePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeGroupId = searchParams.get('group');

    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState([]);
    const [fullProducts, setFullProducts] = useState({}); // Stores high-fidelity product data (with names/full variants)
    const [modalProduct, setModalProduct] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [productsData, groupsData] = await Promise.all([
                SellAuth.getProducts(),
                SellAuth.getGroups()
            ]);

            const structuredGroups = groupsData.map(group => ({
                ...group,
                products: productsData.filter(p => String(p.group_id) === String(group.id))
            })).filter(g => g.products.length > 0);

            const groupedIds = new Set(structuredGroups.flatMap(g => g.products.map(p => p.id)));
            const soloProducts = productsData.filter(p => !groupedIds.has(p.id));
            if (soloProducts.length > 0) {
                structuredGroups.push({ id: 'misc', name: 'All Products', products: soloProducts });
            }

            setGroups(structuredGroups);
            setLoading(false);
        };
        fetchData();
    }, []);

    // Fetch full product details (high-fidelity variants/names) when a category is opened
    useEffect(() => {
        if (!activeGroupId || groups.length === 0) return;
        const group = groups.find(g => String(g.id) === String(activeGroupId));
        if (!group) return;
        const toFetch = group.products.filter(p => !(p.id in fullProducts));
        if (toFetch.length === 0) return;
        Promise.all(
            toFetch.map(p => SellAuth.getProductDetails(p.id).then(d => d ? { id: p.id, data: d } : null))
        ).then(results => {
            const map = {};
            results.forEach(r => { if (r) map[r.id] = r.data; });
            setFullProducts(prev => ({ ...prev, ...map }));
        });
    }, [activeGroupId, groups]);

    const activeGroup = groups.find(g => String(g.id) === String(activeGroupId));
    const displayProducts = activeGroup ? activeGroup.products : [];

    const openModal = (product) => {
        setModalProduct(product);
    };

    return (
        <div className="min-h-screen bg-transparent selection-blue relative overflow-hidden">
            <MouseGlow />

            {/* Navbar */}
            <nav className="glass h-20 px-6 flex items-center justify-between border-b border-white/5 sticky top-0 z-50">
                {activeGroupId ? (
                    <button onClick={() => setSearchParams({})} className="flex items-center gap-2 text-muted hover:text-accent transition-all group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-extrabold text-[10px] uppercase tracking-[0.3em]">All Categories</span>
                    </button>
                ) : (
                    <Link to="/" className="flex items-center gap-2 text-muted hover:text-accent transition-all group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-extrabold text-[10px] uppercase tracking-[0.3em]">Back to Home</span>
                    </Link>
                )}
                <img src="/logo.png" alt="Meta Cheats" className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                <div className="w-28 text-right">
                    {activeGroupId && <span className="text-[10px] font-black uppercase tracking-widest text-accent">{activeGroup?.name}</span>}
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-16">
                {loading ? (
                    <div className="h-[500px] flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-accent" size={48} />
                        <p className="animate-pulse font-bold text-xs uppercase tracking-[0.3em] text-accent/60">Loading inventory...</p>
                    </div>

                ) : !activeGroupId ? (
                    /* ── CATEGORY VIEW ── */
                    <>
                        <div className="mb-14">
                            <h2 className="text-5xl font-black mb-3 tracking-tighter uppercase italic">Marketplace</h2>
                            <p className="text-muted font-bold uppercase tracking-[0.2em] text-xs">Select a category to browse products.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groups.map((group) => {
                                const cover = group.products.map(p => p.images?.[0]?.url || p.image_url).find(Boolean);
                                return (
                                    <button
                                        key={group.id}
                                        onClick={() => setSearchParams({ group: group.id })}
                                        className="glass rounded-3xl border border-white/5 hover:border-accent/50 transition-all group overflow-hidden text-left relative"
                                    >
                                        <div className="aspect-video relative overflow-hidden">
                                            {cover ? (
                                                <img src={cover} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-accent/10 via-brandPurple/10 to-transparent flex items-center justify-center">
                                                    <span className="text-6xl">{getGroupIcon(group.name)}</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-transparent to-transparent" />
                                        </div>
                                        <div className="p-6 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-black uppercase tracking-tight mb-1 group-hover:text-accent transition-colors">{group.name}</h3>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted">{group.products.length} Product{group.products.length !== 1 ? 's' : ''}</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-accent/20 flex items-center justify-center transition-all group-hover:translate-x-1">
                                                <ChevronRight size={20} className="text-muted group-hover:text-accent transition-colors" />
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </>

                ) : (
                    /* ── PRODUCT VIEW ── */
                    <>
                        <div className="mb-14">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-4xl">{getGroupIcon(activeGroup?.name)}</span>
                                <h2 className="text-5xl font-black tracking-tighter uppercase italic">{activeGroup?.name}</h2>
                            </div>
                            <p className="text-muted font-bold uppercase tracking-[0.2em] text-xs">{displayProducts.length} product{displayProducts.length !== 1 ? 's' : ''} — click any card to view plans &amp; checkout.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayProducts.map((product) => {
                                const fullData = fullProducts[product.id] || product;
                                const image = product.images?.[0]?.url || product.image_url || null;
                                const variants = fullData.variants || product.variants || [];
                                const lowestPrice = variants.reduce((min, v) => {
                                    const p = parseFloat(v.price);
                                    return p < min ? p : min;
                                }, Infinity);
                                const desc = stripHtml(fullData.description || product.description);

                                return (
                                    <div
                                        key={product.id}
                                        onClick={() => openModal(product)}
                                        className="glass rounded-3xl border border-white/5 hover:border-accent/40 transition-all group flex flex-col overflow-hidden cursor-pointer"
                                    >
                                        {/* Image */}
                                        <div className="aspect-video relative overflow-hidden bg-white/5">
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-20">
                                                    <img src="/logo.png" alt="" className="h-10 object-contain" />
                                                </div>
                                            )}
                                            {lowestPrice !== Infinity && (
                                                <div className="absolute bottom-3 left-3 bg-[#08080A]/90 backdrop-blur-md border border-accent/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-accent">
                                                    From ${lowestPrice.toFixed(2)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-lg font-black uppercase tracking-tight mb-2 group-hover:text-accent transition-colors">{product.name}</h3>
                                            <p className="text-muted text-sm leading-relaxed font-medium line-clamp-2 mb-4 flex-grow">
                                                {desc || 'Click to view plans and checkout.'}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-muted font-black uppercase tracking-widest">
                                                    {variants.length} plan{variants.length !== 1 ? 's' : ''} available
                                                </span>
                                                <span className="text-accent font-black text-[10px] uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                    View Plans <ArrowRight size={12} />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </main>

            {/* Product Modal */}
            <AnimatePresence>
                {modalProduct && (() => {
                    const fullData = fullProducts[modalProduct.id] || modalProduct;
                    return (
                        <ProductModal
                            product={fullData}
                            description={stripHtml(fullData.description || modalProduct.description)}
                            onClose={() => setModalProduct(null)}
                        />
                    );
                })()}
            </AnimatePresence>
        </div>
    );
};

export default StorePage;
