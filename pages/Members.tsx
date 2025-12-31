import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import MemberCard from '../components/cards/MemberCard';
import { Member } from '../types';
import { getMembers } from '../services/mockApi';
import { Search } from 'lucide-react';

const Members = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

    useEffect(() => {
        getMembers().then(setMembers);
    }, []);

    const filteredMembers = members.filter(member => {
        const matchesSearch = 
            member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.position.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesTab = activeTab === 'all' ? true : member.is_friend;

        return matchesSearch && matchesTab;
    });

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            <Header title="Members Directory" showSearch={false} />
            
            <div className="sticky top-[68px] z-20 bg-gray-50 px-4 pt-4 pb-2 backdrop-blur-sm">
                {/* Search Bar */}
                <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-primary-900/10 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 sm:text-sm transition-all shadow-sm"
                        placeholder="Search members, companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex p-1 bg-white rounded-xl border border-primary-900/10 shadow-sm">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                            activeTab === 'all' 
                                ? 'bg-primary-50 text-primary-600 shadow-sm border border-primary-900/10' 
                                : 'text-gray-500 hover:text-gray-700 border border-transparent'
                        }`}
                    >
                        All Members
                    </button>
                    <button
                        onClick={() => setActiveTab('my')}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                            activeTab === 'my' 
                                ? 'bg-primary-50 text-primary-600 shadow-sm border border-primary-900/10' 
                                : 'text-gray-500 hover:text-gray-700 border border-transparent'
                        }`}
                    >
                        My Members
                    </button>
                </div>
            </div>

            <div className="px-4 grid grid-cols-2 gap-3 mt-2">
                {filteredMembers.map(member => (
                    <MemberCard key={member.id} member={member} />
                ))}
                
                {/* Visual filler if needed for demo, only showing if we have results to prevent empty state weirdness */}
                {filteredMembers.length > 0 && activeTab === 'all' && searchTerm === '' && members.map(member => (
                    <MemberCard key={`dup-${member.id}`} member={{...member, id: member.id + 100}} />
                ))}

                {filteredMembers.length === 0 && (
                    <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <Search size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-gray-900 font-bold text-sm">No members found</h3>
                        <p className="text-gray-500 text-xs mt-1">Try adjusting your search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Members;