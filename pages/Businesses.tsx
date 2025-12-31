import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import BusinessCard from '../components/cards/BusinessCard';
import { Business } from '../types';
import { getBusinesses } from '../services/mockApi';
import { Search, Plus, MapPin, Upload, Building2, AlignLeft, Clock, Mail, Phone, Globe, Package } from 'lucide-react';

const Businesses = () => {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<'all' | 'my' | 'new'>('all');
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        getBusinesses().then(setBusinesses);
    }, []);

    const categories = ['All', 'Manufacturing', 'Agriculture', 'Tech', 'Hospitality', 'Retail'];

    const filteredBusinesses = businesses.filter(business => {
        // Tab Filter
        if (activeTab === 'my' && !business.is_owned) return false;

        // Category Filter
        if (selectedCategory !== 'All' && business.category !== selectedCategory) return false;

        // Search Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (
                business.name.toLowerCase().includes(term) ||
                business.description.toLowerCase().includes(term)
            );
        }

        return true;
    });

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            <Header title="Business Directory" showSearch={false} />
            
            <div className="sticky top-[68px] z-20 bg-gray-50 px-4 pt-4 pb-2 backdrop-blur-sm">
                
                {/* Search Bar (Hidden if Listing New) */}
                {activeTab !== 'new' && (
                    <div className="relative mb-3">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-primary-900/10 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 sm:text-sm transition-all shadow-sm"
                            placeholder="Find a business..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}

                {/* Main Tabs */}
                <div className="flex p-1 bg-white rounded-xl border border-primary-900/10 shadow-sm mb-3">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                            activeTab === 'all' 
                                ? 'bg-primary-50 text-primary-600 shadow-sm border border-primary-900/10' 
                                : 'text-gray-500 hover:text-gray-700 border border-transparent'
                        }`}
                    >
                        All Businesses
                    </button>
                    <button
                        onClick={() => setActiveTab('my')}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                            activeTab === 'my' 
                                ? 'bg-primary-50 text-primary-600 shadow-sm border border-primary-900/10' 
                                : 'text-gray-500 hover:text-gray-700 border border-transparent'
                        }`}
                    >
                        My Businesses
                    </button>
                    <button
                        onClick={() => setActiveTab('new')}
                        className={`flex-none px-3 py-2 flex items-center gap-1 text-xs font-semibold rounded-lg transition-all ${
                            activeTab === 'new' 
                                ? 'bg-primary-600 text-white shadow-sm border border-primary-900/10' 
                                : 'text-primary-600 bg-primary-50 hover:bg-primary-100 border border-primary-900/10'
                        }`}
                    >
                        <Plus size={14} />
                        List New
                    </button>
                </div>
                
                {/* Category Pills (Hidden if Listing New) */}
                {activeTab !== 'new' && (
                     <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {categories.map((cat, i) => (
                             <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`
                                    px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors border
                                    ${selectedCategory === cat 
                                        ? 'bg-primary-100 text-primary-700 border-primary-200' 
                                        : 'bg-white text-gray-400 border-primary-900/10 hover:bg-gray-50'}
                                `}
                             >
                                 {cat}
                             </button>
                        ))}
                     </div>
                )}
            </div>

            <div className="px-4 mt-2">
                {activeTab === 'new' ? (
                    // List New Business Form View - UPDATED
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-primary-900/10 animate-in fade-in duration-300">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-2 text-primary-600 ring-1 ring-primary-900/10">
                                <Building2 size={24} />
                            </div>
                            <h3 className="font-bold text-gray-800">Register Business</h3>
                            <p className="text-xs text-gray-400">Provide full details for your profile page.</p>
                        </div>

                        <div className="space-y-4">
                            {/* Basic Info */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Business Name</label>
                                <input type="text" className="w-full bg-white border border-primary-900/10 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none" placeholder="e.g. Tofa Textiles Ltd" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                                    <select className="w-full bg-white border border-primary-900/10 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none text-gray-600">
                                        <option>Select...</option>
                                        <option>Manufacturing</option>
                                        <option>Agriculture</option>
                                        <option>Tech</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Operating Hours</label>
                                    <div className="relative">
                                        <input type="text" className="w-full bg-white border border-primary-900/10 rounded-xl pl-8 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none" placeholder="e.g. 9am-5pm" />
                                        <Clock size={14} className="absolute left-3 top-3 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-3 pt-2 border-t border-primary-900/10">
                                <h4 className="text-xs font-bold text-gray-500 uppercase">Contact Details</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <input type="tel" className="w-full bg-white border border-primary-900/10 rounded-xl pl-8 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none" placeholder="Phone" />
                                        <Phone size={14} className="absolute left-3 top-3 text-gray-400" />
                                    </div>
                                    <div className="relative">
                                        <input type="email" className="w-full bg-white border border-primary-900/10 rounded-xl pl-8 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none" placeholder="Email" />
                                        <Mail size={14} className="absolute left-3 top-3 text-gray-400" />
                                    </div>
                                </div>
                                <div className="relative">
                                    <input type="text" className="w-full bg-white border border-primary-900/10 rounded-xl pl-8 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none" placeholder="Website URL" />
                                    <Globe size={14} className="absolute left-3 top-3 text-gray-400" />
                                </div>
                                <div className="relative">
                                    <input type="text" className="w-full bg-white border border-primary-900/10 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none" placeholder="Physical Address" />
                                    <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                                </div>
                            </div>

                            {/* Description & Products */}
                            <div className="space-y-3 pt-2 border-t border-primary-900/10">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">About the Business</label>
                                    <div className="relative">
                                        <textarea className="w-full bg-white border border-primary-900/10 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none h-24 resize-none" placeholder="Tell us what you do..."></textarea>
                                        <AlignLeft size={16} className="absolute left-3 top-3 text-gray-400" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Key Products/Services</label>
                                    <div className="relative">
                                        <textarea className="w-full bg-white border border-primary-900/10 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none h-16 resize-none" placeholder="List your main offerings (comma separated)"></textarea>
                                        <Package size={16} className="absolute left-3 top-3 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="border-2 border-dashed border-primary-900/20 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-primary-200 transition-colors cursor-pointer">
                                <Upload size={24} className="mb-2" />
                                <span className="text-xs font-medium">Upload Logo & Cover Image</span>
                            </div>

                            <button className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-200 active:scale-[0.98] transition-all border border-primary-900/10">
                                Create Business Profile
                            </button>
                        </div>
                    </div>
                ) : (
                    // Business List View
                    <>
                        {filteredBusinesses.map(business => (
                            <BusinessCard key={business.id} business={business} />
                        ))}
                        
                        {/* Duplicate for visual density in demo if filtering matches generic terms */}
                        {filteredBusinesses.length > 0 && selectedCategory === 'All' && searchTerm === '' && businesses.map(business => (
                            <BusinessCard key={`dup-${business.id}`} business={{...business, id: business.id + 100}} />
                        ))}

                        {filteredBusinesses.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                    <Search size={24} className="text-gray-400" />
                                </div>
                                <h3 className="text-gray-900 font-bold text-sm">No businesses found</h3>
                                <p className="text-gray-500 text-xs mt-1">Try changing your filters</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Businesses;