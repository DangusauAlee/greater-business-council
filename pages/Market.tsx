import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Plus, ShoppingBag, Upload, Tag, MapPin, DollarSign, Filter, Package } from 'lucide-react';
import { Classified } from '../types';
import { getClassifieds } from '../services/mockApi';

const Market = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<Classified[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        getClassifieds().then(setItems);
    }, []);

    const categories = ['All', 'Machinery', 'Real Estate', 'Vehicles', 'Electronics', 'Services'];

    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (isCreating) {
        return (
            <div className="pb-24 bg-gray-50 min-h-screen">
                <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 py-3 flex items-center gap-3 shadow-sm border-b border-primary-900/10">
                    <button 
                        onClick={() => setIsCreating(false)}
                        className="p-2 bg-white border border-primary-900/10 rounded-full text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">Sell Item</h1>
                </div>

                <div className="px-4 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-primary-900/10">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-600 ring-1 ring-emerald-100">
                                <ShoppingBag size={24} />
                            </div>
                            <h3 className="font-bold text-gray-800">New Listing</h3>
                            <p className="text-xs text-gray-400">Reach thousands of buyers in Kano.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Item Title</label>
                                <input type="text" className="w-full bg-white border border-primary-900/10 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none" placeholder="e.g. 50KVA Generator" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Price (₦)</label>
                                    <div className="relative">
                                        <input type="text" className="w-full bg-white border border-primary-900/10 rounded-xl pl-8 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none" placeholder="0.00" />
                                        <span className="absolute left-3 top-2.5 text-gray-400 text-xs font-bold">₦</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                                    <select className="w-full bg-white border border-primary-900/10 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none text-gray-600">
                                        {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Condition</label>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-2 rounded-xl border border-primary-600 bg-primary-50 text-primary-700 text-xs font-bold">Used</button>
                                    <button className="flex-1 py-2 rounded-xl border border-primary-900/10 bg-white text-gray-500 text-xs font-bold">New</button>
                                </div>
                            </div>

                             <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                                <div className="relative">
                                    <input type="text" className="w-full bg-white border border-primary-900/10 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none" placeholder="Pickup Area" />
                                    <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                                <div className="relative">
                                    <textarea className="w-full bg-white border border-primary-900/10 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none h-32 resize-none" placeholder="Describe your item..."></textarea>
                                    <Tag size={16} className="absolute left-3 top-3 text-gray-400" />
                                </div>
                            </div>

                            <div className="border-2 border-dashed border-primary-900/20 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-primary-200 transition-colors cursor-pointer">
                                <Upload size={24} className="mb-2" />
                                <span className="text-xs font-medium">Add Photos (Max 5)</span>
                            </div>

                            <button className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-200 active:scale-[0.98] transition-all border border-primary-900/10">
                                Post Listing
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
             {/* Header */}
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-sm border-b border-primary-900/10">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white border border-primary-900/10 rounded-full text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">Marketplace</h1>
                </div>
                <button 
                    onClick={() => setIsCreating(true)}
                    className="px-3 py-2 bg-primary-600 text-white rounded-full text-xs font-bold shadow-md shadow-primary-200 flex items-center gap-1 active:scale-95 transition-all"
                >
                    <Plus size={16} />
                    Sell
                </button>
            </div>

            {/* Search & Categories */}
            <div className="sticky top-[60px] z-20 bg-gray-50 px-4 pt-4 pb-2 backdrop-blur-sm">
                <div className="relative mb-3">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-primary-900/10 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 sm:text-sm transition-all shadow-sm"
                        placeholder="Search for cars, equipment, office space..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                 <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {categories.map((cat) => (
                         <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`
                                px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors border
                                ${selectedCategory === cat 
                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                    : 'bg-white text-gray-400 border-primary-900/10 hover:bg-gray-50'}
                            `}
                         >
                             {cat}
                         </button>
                    ))}
                 </div>
            </div>

            {/* Items Grid */}
            <div className="px-4 mt-2">
                <div className="grid grid-cols-2 gap-3">
                    {filteredItems.map(item => (
                        <div 
                            key={item.id}
                            onClick={() => navigate(`/market/${item.id}`)}
                            className="bg-white p-2 rounded-2xl shadow-sm border border-primary-900/10 active:scale-[0.98] transition-all cursor-pointer hover:shadow-md"
                        >
                            <div className="h-36 rounded-xl bg-gray-100 mb-2 overflow-hidden border border-primary-900/10 relative">
                                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                {item.condition && (
                                    <span className="absolute top-1 right-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                                        {item.condition}
                                    </span>
                                )}
                            </div>
                            <h4 className="font-bold text-xs text-gray-800 line-clamp-1 mb-0.5">{item.title}</h4>
                            <p className="text-primary-600 font-bold text-sm mb-1">{item.price}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded inline-block border border-primary-900/10">
                                    {item.category}
                                </span>
                                <span className="text-[9px] text-gray-400">{item.posted_at?.replace(' ago', '')}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <ShoppingBag size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-gray-900 font-bold text-sm">No items found</h3>
                        <p className="text-gray-500 text-xs mt-1">Try changing your search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Market;