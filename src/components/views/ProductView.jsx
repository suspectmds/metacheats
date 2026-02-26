import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';

const ProductView = ({ setView, selectedGroup, selectedProduct, handlePurchase }) => {
    const [selectedVariant, setSelectedVariant] = useState(
        selectedProduct?.variants?.[0] || null
    );

    return (
        <div className="pt-48 pb-32 max-w-4xl mx-auto px-6">
            <div className="flex items-center space-x-4 mb-12">
                <button onClick={() => setView('Group')} className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-white transition-colors pointer-events-auto"><ArrowLeft size={16} /></button>
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{selectedGroup?.name} / {selectedProduct?.name}</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[48px] overflow-hidden">
                <div className="relative h-96 overflow-hidden bg-black/40 border-b border-white/5">
                    <img
                        src={selectedProduct?.images?.[0]?.url || selectedProduct?.image_url || selectedProduct?.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"}
                        alt={selectedProduct?.name}
                        className="w-full h-full object-cover grayscale transition-all duration-1000 opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>
                <div className="p-12 md:p-20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                        <h2 className="text-6xl font-black italic text-white uppercase tracking-tighter leading-none">{selectedProduct?.name}</h2>
                        <div className="text-4xl font-black italic text-emerald-400 tracking-tighter">
                            ${selectedVariant?.price || selectedProduct?.price_formatted || selectedProduct?.price}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {['KERNEL LEVEL', 'UNDETECTED', 'INSTANT KEY'].map(feat => (
                            <div key={feat} className="flex items-center space-x-3 px-6 py-4 bg-white/5 border border-white/5 rounded-2xl">
                                <CheckCircle2 size={16} className="text-emerald-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{feat}</span>
                            </div>
                        ))}
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <div
                            className="text-white/60 leading-relaxed text-sm mb-12 bg-white/[0.03] p-10 rounded-[32px] border border-white/10 shadow-inner backdrop-blur-sm"
                            dangerouslySetInnerHTML={{ __html: selectedProduct?.description || (selectedVariant?.description) || '<p class="text-white/20 italic">No detailed intelligence available for this module.</p>' }}
                        />
                    </div>

                    {selectedProduct?.variants && selectedProduct.variants.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-white text-sm font-black uppercase tracking-widest mb-6">Select Variant</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {selectedProduct.variants.map(variant => (
                                    <button
                                        key={variant.id}
                                        onClick={() => setSelectedVariant(variant)}
                                        className={`p-4 rounded-2xl border text-left transition-all pointer-events-auto ${selectedVariant?.id === variant.id
                                            ? 'bg-emerald-500/10 border-emerald-500 text-white'
                                            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="font-bold text-sm mb-1">{variant.name}</div>
                                        <div className={`text-xs ${selectedVariant?.id === variant.id ? 'text-emerald-400' : 'text-white/30'}`}>
                                            ${variant.price}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button onClick={() => handlePurchase(selectedProduct, selectedVariant)} className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.2em] text-[11px] rounded-[24px] hover:bg-emerald-500 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] pointer-events-auto">
                        Secure Deployment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductView;
