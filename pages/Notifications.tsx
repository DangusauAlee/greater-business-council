import React, { useEffect, useState } from 'react';
import { ArrowLeft, MessageCircle, Heart, MessageSquare, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../types';
import { getNotifications } from '../services/mockApi';

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        getNotifications().then(setNotifications);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'like': return <Heart size={14} className="text-white" />;
            case 'comment': return <MessageSquare size={14} className="text-white" />;
            case 'message': return <MessageCircle size={14} className="text-white" />;
            default: return <Info size={14} className="text-white" />;
        }
    };

    const getIconBg = (type: string) => {
        switch (type) {
            case 'like': return 'bg-red-500';
            case 'comment': return 'bg-blue-500';
            case 'message': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const handleNotificationClick = (notif: Notification) => {
        if (notif.type === 'message' && notif.reference_id) {
            navigate(`/messages/chat/${notif.reference_id}`);
        } else if ((notif.type === 'like' || notif.type === 'comment') && notif.reference_id) {
            navigate(`/profile/${notif.reference_id}`);
        } else if (notif.type === 'system') {
             // System notifications might link to settings or a specific page
             navigate('/profile'); 
        }
    };

    return (
        <div className="pb-24 bg-gray-50 min-h-screen animate-in slide-in-from-right duration-300">
            {/* Custom Header */}
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 py-3 flex items-center gap-3 shadow-sm border-b border-primary-900/10">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2 bg-white border border-primary-900/10 rounded-full text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-lg font-bold text-gray-800">Notifications</h1>
            </div>

            <div className="px-4 py-4 space-y-3">
                {notifications.map(notif => (
                    <div 
                        key={notif.id} 
                        onClick={() => handleNotificationClick(notif)}
                        className={`
                            relative flex gap-4 p-4 rounded-2xl border border-primary-900/10 transition-all cursor-pointer active:scale-[0.98]
                            ${notif.is_read ? 'bg-white hover:bg-gray-50' : 'bg-primary-50/50 hover:bg-primary-50'}
                        `}
                    >
                        <div className="relative shrink-0">
                            <img 
                                src={notif.actor_avatar} 
                                alt={notif.actor_name} 
                                className="w-12 h-12 rounded-full object-cover border border-primary-900/10"
                            />
                            <div className={`
                                absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white
                                ${getIconBg(notif.type)}
                            `}>
                                {getIcon(notif.type)}
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="text-sm font-bold text-gray-900 truncate pr-2">{notif.actor_name}</h4>
                                <span className="text-[10px] text-gray-400 whitespace-nowrap">{notif.time}</span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                                {notif.content}
                            </p>
                        </div>
                        
                        {!notif.is_read && (
                            <div className="absolute top-1/2 -translate-y-1/2 right-3 w-2 h-2 rounded-full bg-primary-600"></div>
                        )}
                    </div>
                ))}

                {notifications.length === 0 && (
                     <div className="text-center py-12 text-gray-400 text-sm">No new notifications</div>
                )}
            </div>
        </div>
    );
};

export default Notifications;