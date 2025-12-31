import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Briefcase, Compass, MessageCircle } from 'lucide-react';

const BottomNav = () => {
    const navItems = [
        { path: '/home', icon: Home, label: 'Home' },
        { path: '/members', icon: Users, label: 'Members' },
        { path: '/businesses', icon: Briefcase, label: 'Biz' },
        { path: '/explore', icon: Compass, label: 'Explore' },
        { path: '/messages', icon: MessageCircle, label: 'Chat' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-primary-600 pb-safe pt-2 px-2 z-40 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.3)] rounded-t-2xl">
            <div className="flex justify-around items-end pb-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex flex-col items-center justify-center w-14 py-1 transition-all duration-300
                            ${isActive ? 'text-white -translate-y-1' : 'text-primary-200'}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`
                                    p-1.5 rounded-2xl transition-all duration-300 mb-1 border
                                    ${isActive ? 'bg-white/20 border-white/30 shadow-sm backdrop-blur-sm' : 'bg-transparent border-transparent'}
                                `}>
                                    <item.icon 
                                        size={22} 
                                        strokeWidth={isActive ? 2.5 : 2} 
                                        fill={isActive ? "currentColor" : "none"} 
                                        className={isActive ? "text-white" : "text-primary-200"}
                                    />
                                </div>
                                <span className={`text-[10px] font-medium ${isActive ? 'text-white' : 'text-primary-200'}`}>
                                    {item.label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;