import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Conversation, Member } from '../types';
import { getConversations, getMembers } from '../services/mockApi';
import { Edit, Search, X, MessageSquarePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Messages = () => {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);
    const [friends, setFriends] = useState<Member[]>([]);
    const [friendSearch, setFriendSearch] = useState("");

    useEffect(() => {
        getConversations().then(setConversations);
        getMembers().then(members => {
            // Filter only verified friends for the new chat list
            setFriends(members.filter(m => m.is_friend));
        });
    }, []);

    const openChat = (userId: number) => {
        navigate(`/messages/chat/${userId}`);
    };

    const filteredFriends = friends.filter(f => 
        f.full_name.toLowerCase().includes(friendSearch.toLowerCase()) || 
        f.company.toLowerCase().includes(friendSearch.toLowerCase())
    );

    return (
        <div className="pb-24 bg-white min-h-screen relative">
            <Header title="Messages" />
            
            <div className="px-4 py-2">
                <input 
                    type="text" 
                    placeholder="Search messages..." 
                    className="w-full bg-white border border-primary-900/10 rounded-2xl py-3 px-4 text-sm text-gray-700 focus:ring-2 focus:ring-primary-100 outline-none"
                />
            </div>

            <div className="mt-2">
                {conversations.map(conv => (
                    <div 
                        key={conv.id} 
                        onClick={() => openChat(conv.with_user.id)}
                        className="flex items-center gap-3 p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-primary-900/10 cursor-pointer"
                    >
                        <div className="relative">
                            <img 
                                src={conv.with_user.avatar_url} 
                                alt={conv.with_user.name} 
                                className="w-12 h-12 rounded-full object-cover border border-primary-900/10"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white ring-1 ring-primary-900/10"></div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="font-bold text-sm text-gray-900 truncate">{conv.with_user.name}</h3>
                                <span className="text-[10px] text-gray-400">{conv.last_message_at}</span>
                            </div>
                            <p className={`text-xs truncate ${conv.unread_count > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                {conv.last_message}
                            </p>
                        </div>
                        
                        {conv.unread_count > 0 && (
                            <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center border border-primary-900/10">
                                <span className="text-[10px] font-bold text-white">{conv.unread_count}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Floating Action Button */}
            <button 
                onClick={() => setIsNewChatOpen(true)}
                className="fixed bottom-24 right-4 w-14 h-14 bg-primary-600 rounded-full shadow-lg shadow-primary-200 flex items-center justify-center text-white active:scale-95 transition-all z-20"
            >
                <MessageSquarePlus size={24} />
            </button>

            {/* New Chat Modal/Sheet */}
            {isNewChatOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsNewChatOpen(false)}
                    ></div>
                    <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-[2rem] shadow-xl border-t border-primary-900/10 h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-primary-900/10">
                            <h3 className="font-bold text-gray-800 text-lg">New Chat</h3>
                            <button 
                                onClick={() => setIsNewChatOpen(false)}
                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="px-4 py-3">
                             <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-3 border border-primary-900/10 rounded-2xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 sm:text-sm transition-all"
                                    placeholder="Search friends..."
                                    value={friendSearch}
                                    onChange={(e) => setFriendSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Connected Members</p>
                            {filteredFriends.map(friend => (
                                <div 
                                    key={friend.id}
                                    onClick={() => openChat(friend.user_id)}
                                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 cursor-pointer active:scale-[0.98] transition-all"
                                >
                                    <img src={friend.image_url} alt={friend.full_name} className="w-12 h-12 rounded-full border border-primary-900/10" />
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900">{friend.full_name}</h4>
                                        <p className="text-xs text-gray-500">{friend.company}</p>
                                    </div>
                                </div>
                            ))}
                            {filteredFriends.length === 0 && (
                                <div className="text-center py-10 text-gray-400 text-sm">
                                    No connections found.
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Messages;